import React, { useEffect, useMemo, useRef } from "react";
import { MathText } from "./MathText";
import type { UnitLessons } from "../types";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { extractLessonText } from "../utils/textExtractor";


interface LessonViewerProps {
  book: UnitLessons[];
  autoStartNarration?: boolean;
}

// Using custom MathText that loads MathJax from CDN, no external hooks

const LessonViewerContent: React.FC<{ book: UnitLessons[]; autoStartNarration?: boolean }> = ({ 
  book, 
  autoStartNarration = false 
}) => {
  const [selectedUnitIdx] = React.useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = React.useState(0);
  const unit = book[selectedUnitIdx];
  const lesson = unit.lessons[selectedLessonIdx];
  
  // TTS for lesson narration
  const {
    speak,
    pause: pauseTTS,
    resume: resumeTTS,
    stop: stopTTS,
    isPlaying,
    isPaused,
  } = useTextToSpeech({ rate: 1 });
  
  const autoStartRef = useRef(autoStartNarration);
  
  // Extract lesson text for narration
  const lessonText = useMemo(() => {
    if (!lesson) return '';
    return extractLessonText(lesson);
  }, [lesson]);

  
  // Auto-start narration if requested
  useEffect(() => {
    if (autoStartRef.current && lessonText && !isPlaying && !isPaused) {
      autoStartRef.current = false; // Only auto-start once
      speak(lessonText);
    }
  }, [lessonText, isPlaying, isPaused, speak]);
  
  // Stop narration when lesson changes
  useEffect(() => {
    stopTTS();
  }, [selectedLessonIdx, stopTTS]);

  // Listen for voice commands from CommandExecutor
  useEffect(() => {
    const handleLessonControl = (event: CustomEvent) => {
      const { action } = event.detail;
      
      switch (action) {
        case 'play':
          if (lessonText && !isPlaying) {
            speak(lessonText);
          }
          break;
        case 'pause':
          if (isPlaying) {
            pauseTTS();
          }
          break;
        case 'resume':
          if (isPaused) {
            resumeTTS();
          }
          break;
        case 'stop':
          stopTTS();
          break;
        case 'next':
          if (selectedLessonIdx < unit.lessons.length - 1) {
            setSelectedLessonIdx(selectedLessonIdx + 1);
          }
          break;
        case 'previous':
          if (selectedLessonIdx > 0) {
            setSelectedLessonIdx(selectedLessonIdx - 1);
          }
          break;
        default:
          console.warn('Unknown action:', action);
      }
    };

    window.addEventListener('lesson-control', handleLessonControl as EventListener);
    return () => {
      window.removeEventListener('lesson-control', handleLessonControl as EventListener);
    };
  }, [lessonText, isPlaying, isPaused, speak, pauseTTS, resumeTTS, stopTTS, selectedLessonIdx, unit.lessons.length]);

  return (
      <div style={{ display: "flex", height: "100vh", background: "#f8fafc" }}>
        {/* Sidebar */}
        <div style={{ width: 340, background: "#fff", borderRight: "1px solid #e5e7eb", padding: 24, overflowY: "auto" }}>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{unit.unitTitle}</div>
          <div style={{ color: "#64748b", fontSize: 15, marginBottom: 24 }}>{unit.unitDescription}</div>
          <div>
            {unit.lessons.map((l, idx) => (
              <div
                key={l.sectionId}
                onClick={() => setSelectedLessonIdx(idx)}
                style={{
                  background: idx === selectedLessonIdx ? "#f1f5f9" : undefined,
                  borderRadius: 6,
                  padding: "10px 14px",
                  marginBottom: 6,
                  cursor: "pointer",
                  fontWeight: idx === selectedLessonIdx ? 600 : 400,
                  color: idx === selectedLessonIdx ? "#2563eb" : "#0f172a",
                  borderLeft: idx === selectedLessonIdx ? "3px solid #2563eb" : "3px solid transparent",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {l.title}
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div style={{ flex: 1, padding: 40, overflowY: "auto" }}>
          {/* Playback Controls */}
          <div style={{ 
            display: 'flex', 
            gap: 12, 
            marginBottom: 24, 
            padding: 16,
            background: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: 14, color: '#64748b', marginRight: 'auto' }}>
              {isPlaying && !isPaused && '▶️ Playing'}
              {isPaused && '⏸️ Paused'}
              {!isPlaying && !isPaused && '⏹️ Stopped'}
            </div>
            <button
              onClick={() => speak(lessonText)}
              disabled={isPlaying && !isPaused}
              style={{
                padding: '8px 16px',
                background: isPlaying && !isPaused ? '#cbd5e1' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: isPlaying && !isPaused ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              ▶️ Play
            </button>
            <button
              onClick={pauseTTS}
              disabled={!isPlaying || isPaused}
              style={{
                padding: '8px 16px',
                background: !isPlaying || isPaused ? '#cbd5e1' : '#f59e0b',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: !isPlaying || isPaused ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              ⏸️ Pause
            </button>
            <button
              onClick={resumeTTS}
              disabled={!isPaused}
              style={{
                padding: '8px 16px',
                background: !isPaused ? '#cbd5e1' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: !isPaused ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              ▶️ Resume
            </button>
            <button
              onClick={stopTTS}
              disabled={!isPlaying && !isPaused}
              style={{
                padding: '8px 16px',
                background: !isPlaying && !isPaused ? '#cbd5e1' : '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: !isPlaying && !isPaused ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              ⏹️ Stop
            </button>
            <div style={{ fontSize: 12, color: '#94a3b8', marginLeft: 12 }}>
              💡 Say "play", "pause", "resume", "stop"
            </div>
          </div>
          
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{lesson.title}</div>
          <div style={{ fontSize: 18, color: "#334155", marginBottom: 24 }}>
            <MathText text={lesson.lessonContent.introduction} />
          </div>
          <div>
            {lesson.lessonContent.coreConcepts.map((concept, i) => (
              <div key={i} style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{concept.conceptTitle}</div>
                <div style={{ fontSize: 16, color: "#334155", marginBottom: 6 }}>
                  <MathText text={concept.explanation} />
                </div>
                <div style={{ fontSize: 15, color: "#475569", marginBottom: 4 }}>
                  <b>Example:</b> <MathText text={concept.example} />
                </div>
                <div style={{ fontSize: 14, color: "#64748b" }}>
                  <b>Diagram:</b> {concept.diagramDescription}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Summary</div>
            <ul style={{ marginLeft: 20 }}>
              {lesson.lessonContent.summary.map((point, i) => (
                <li key={i} style={{ fontSize: 15, color: "#334155", marginBottom: 2 }}>
                  <MathText text={point} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Quick Check Questions</div>
            <ul style={{ marginLeft: 20 }}>
              {lesson.lessonContent.quickCheckQuestions.map((q, i) => (
                <li key={i} style={{ fontSize: 15, color: "#334155", marginBottom: 8 }}>
                  <b>Q:</b> <MathText text={q.question} />
                  <br />
                  <b>A:</b> <MathText text={q.answer} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
};

export const LessonViewer: React.FC<LessonViewerProps> = ({ book, autoStartNarration }) => {
  return <LessonViewerContent book={book} autoStartNarration={autoStartNarration} />;
};

// Example usage (hardcoded for now):
// import { lessonBookData } from "../data/lessonBookData";
// <LessonViewer book={lessonBookData} />
