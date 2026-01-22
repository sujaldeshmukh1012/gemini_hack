import React from 'react';
import { useVoiceAgent } from './VoiceAgentProvider';

export const VoiceAgentControls: React.FC = () => {
  const {
    isListening,
    isSupported,
    transcript,
    error,
    toggleListening,
  } = useVoiceAgent();

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Floating Voice Toggle Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleListening}
          aria-label={isListening ? "Stop Recording" : "Start Recording"}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: isListening ? '#ef4444' : '#2563eb',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
            position: 'relative',
          }}
          title={isListening ? "Stop Recording" : "Start Recording"}
        >
          {/* Listening indicator animation */}
          {isListening && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid currentColor',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          )}
          
          {/* Microphone icon */}
          <svg
            width="28"
            height="28"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            {isListening ? (
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            ) : (
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            )}
          </svg>
        </button>
      </div>

      {/* Transcript Log (for debugging) */}
      {transcript && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            zIndex: 999,
            background: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: 300,
            fontSize: 12,
            color: '#374151',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Transcript:</div>
          <div>{transcript}</div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            zIndex: 999,
            background: '#fee2e2',
            padding: '12px 16px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: 300,
            fontSize: 12,
            color: '#991b1b',
          }}
        >
          {error}
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
};
