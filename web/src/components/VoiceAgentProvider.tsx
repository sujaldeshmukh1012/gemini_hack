import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioRecorder } from '../utils/audioRecorder';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { useAuth } from '../hooks/useAuth';
import { Modality, StartSensitivity, EndSensitivity } from '@google/genai';
import type { SubjectWithChapters } from '../types';
import { fetchSubjectsWithChapters } from '../data/curriculumData';
import { toolDeclarations } from '../utils/toolDeclarations';
import { CommandExecutor } from '../services/commandExecutor';
import { loadVoiceAgentSettings, saveVoiceAgentSettings } from '../utils/voiceAgentSettings';

interface VoiceAgentContextType {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  autoStartEnabled: boolean;
  setAutoStartEnabled: (value: boolean) => void;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
}

const VoiceAgentContext = createContext<VoiceAgentContextType | null>(null);

export const useVoiceAgent = () => {
  const context = useContext(VoiceAgentContext);
  if (!context) {
    throw new Error('useVoiceAgent must be used within VoiceAgentProvider');
  }
  return context;
};

interface VoiceAgentProviderProps {
  children: React.ReactNode;
}

const stripJsonCodeFence = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed.replace(/^```[a-zA-Z]*\s*/m, '').replace(/```$/m, '').trim();
};

const tryParseJsonFromText = (text: string): any | null => {
  const cleaned = stripJsonCodeFence(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    const slice = cleaned.slice(start, end + 1);
    try {
      return JSON.parse(slice);
    } catch {
      return null;
    }
  }
};

export const VoiceAgentProvider: React.FC<VoiceAgentProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectWithChapters[]>([]);
  const [autoStartEnabled, setAutoStartEnabled] = useState<boolean>(() => {
    const settings = loadVoiceAgentSettings();
    return settings.autoStart === true;
  });

  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const autoStartAttemptedRef = useRef(false);

  // Load subjects when user profile is available
  useEffect(() => {
    if (user?.profile?.curriculumId && user?.profile?.classId) {
      
      fetchSubjectsWithChapters(user.profile.curriculumId, user.profile.classId)
        .then((subjects) => {
          setAvailableSubjects(subjects);
        })
        .catch((error) => {
          console.error('[Voice Agent] Failed to load subjects:', error);
          setAvailableSubjects([]);
        });
    } else {
      setAvailableSubjects([]);
    }
  }, [user?.profile?.curriculumId, user?.profile?.classId]);

  // Initialize command executor with dependencies
  const commandExecutor = useMemo(() => {
    return new CommandExecutor({
      navigate,
      user,
      availableSubjects,
    });
  }, [navigate, user, availableSubjects]);

  // Gemini Live API hook
  const { 
    client, 
    connected: isConnected, 
    connect, 
    setConfig,
    config,
  } = useGeminiLive();

  // Set up Gemini Live API config with tool declarations
  useEffect(() => {
    const config = {
      responseModalities: [Modality.AUDIO],
      systemInstruction: `You are a helpful voice assistant for an educational platform called LearnHub. 
You help students navigate the platform, control lesson playback, and discover content.

When the user makes a request that requires an action, use the available tool/function calls. If you must respond in plain text, output a JSON response with this format:
{
  "hasCommand": true,
  "command": {
    "type": "navigate" | "lesson_control" | "discovery",
    "action": "<specific action>",
    "params": {}
  },
  "confidence": 0.0-1.0,
  "response": "<natural language response>"
}

Available commands:
- Navigation: dashboard, home, setup, chapter, lesson
- Lesson Control: play, pause, resume, stop, next, previous
- Discovery: list_chapters, list_subjects, current_lesson, help
- Accessibility: focus_mode, braille, story_mode
- Chapter/Lesson: open chapter N, start lesson N (use openChapter/openLesson tool calls)
- Top bar: change language to English/Spanish/Hindi, toggle captions/signs/large text/calm motion (use setLanguage + toggle* tools)
- Quiz: "Question 1 option A", "Choose true for question 2", "Submit quiz" (use quizSelectOption/quizSubmit tools)
- Page control: scroll up/down/top/bottom, go back (use scrollPage + navigateHistory tool calls)

Be friendly and helpful. Speak naturally and wait for the user to finish speaking before responding.`,
      realtimeInputConfig: {
        automaticActivityDetection: {
          disabled: false,
          startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
          endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
          prefixPaddingMs: 100,
          silenceDurationMs: 500,
        },
      },
      tools: [
        {
          functionDeclarations: toolDeclarations
        }
      ]
    };

    setConfig(config);
  }, [setConfig]);

  // Persist voice agent settings
  useEffect(() => {
    saveVoiceAgentSettings({ autoStart: autoStartEnabled });
  }, [autoStartEnabled]);

  // Tool call handler - Execute commands from Gemini using CommandExecutor
  useEffect(() => {
    const onToolCall = async (toolCall: any) => {
      
      // Execute commands using the command executor service
      const responses = await commandExecutor.executeToolCall(toolCall);
      
      // Send tool responses back to Gemini
      if (responses.length > 0) {
        client.sendToolResponse({
          functionResponses: responses
        });
      }
    };

    const onContent = (data: any) => {
      if (data.modelTurn?.parts) {
        for (const part of data.modelTurn.parts) {
          if (part.text) {
            const rawText = String(part.text);
            console.log('[Voice Agent] Gemini text response:', rawText);

            const parsed = tryParseJsonFromText(rawText);
            if (parsed?.hasCommand && parsed?.command) {
              commandExecutor.executeCommand(parsed.command).catch((e) => {
                console.warn('[Voice Agent] Failed to execute JSON command:', e);
              });
            }
          }
        }
      }
    };

    const onAudio = (data: ArrayBuffer) => {
      console.log('[Voice Agent] Audio received from Gemini:', {
        size: data.byteLength,
        bytes: data.byteLength,
      });
    };

    const onError = (error: ErrorEvent) => {
      setError(error.message || 'Gemini Live API error');
    };

    client.on('toolcall', onToolCall);
    client.on('content', onContent);
    client.on('audio', onAudio);
    client.on('error', onError);

    return () => {
      client.off('toolcall', onToolCall);
      client.off('content', onContent);
      client.off('audio', onAudio);
      client.off('error', onError);
    };
  }, [client, commandExecutor]);

  // Check browser support for audio
  const isSupported = typeof navigator !== 'undefined' && 
                      typeof navigator.mediaDevices !== 'undefined' && 
                      typeof navigator.mediaDevices.getUserMedia === 'function';

  // Start/stop audio recording
  const startListening = useCallback(async () => {
    try {
      
      // First, ensure we're connected to Gemini Live API
      if (!isConnected || client.status !== 'connected') {
        await connect();
        // Wait for connection to be established (check status, not just isConnected state)
        let attempts = 0;
        while (client.status !== 'connected' && attempts < 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (client.status !== 'connected') {
          throw new Error('Failed to connect to Gemini Live API - connection timeout');
        }
      }

      // Create audio recorder if needed
      if (!audioRecorderRef.current) {
        audioRecorderRef.current = new AudioRecorder(16000);
        
        // Listen for audio data and send to Gemini Live API
        audioRecorderRef.current.on('data', (base64Audio: string) => {
          // Check connection status dynamically
          const currentlyConnected = client.status === 'connected' && client.session;
          if (currentlyConnected) {
            try {
              client.sendRealtimeInput([{
                mimeType: 'audio/pcm;rate=16000',
                data: base64Audio,
              }]);
            } catch (error) {
              console.error('[Voice Agent] Error sending audio:', error);
            }
          } else {
            console.warn('[Voice Agent] Not connected to Gemini Live API, cannot send audio');
          }
        });
      }

      // Start audio recording
      await audioRecorderRef.current.start();
      setIsListening(true);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to start listening';
      console.error('[Voice Agent] Start error:', errorMsg);
      setError(errorMsg);
      setIsListening(false);
    }
  }, [isConnected, connect, client]);

  // Auto-start listening on app start (if enabled). Only try once until toggled off/on.
  useEffect(() => {
    const configReady = !!config && Object.keys(config).length > 0;

    if (!autoStartEnabled) {
      autoStartAttemptedRef.current = false;
      return;
    }
    if (!configReady) return;
    if (!isSupported) return;
    if (isListening) return;
    if (autoStartAttemptedRef.current) return;

    autoStartAttemptedRef.current = true;
    startListening();
  }, [autoStartEnabled, config, isSupported, isListening, startListening]);

  // Disconnect when stopping
  const stopListening = useCallback(() => {
    audioRecorderRef.current?.stop();
    setIsListening(false);
    setTranscript('');
    
    // Optionally disconnect from Gemini (or keep connected for faster reconnection)
    // disconnect();
  }, []);


  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const value: VoiceAgentContextType = {
    isListening,
    isSupported,
    transcript,
    error,
    autoStartEnabled,
    setAutoStartEnabled,
    startListening,
    stopListening,
    toggleListening,
  };

  return (
    <VoiceAgentContext.Provider value={value}>
      {children}
    </VoiceAgentContext.Provider>
  );
};
