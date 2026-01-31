import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

export const AccessibilityDock: React.FC = () => {
  const {
    focusMode,
    highContrast,
    largeText,
    reduceMotion,
    captionsOn,
    deaf,
    toggleFocusMode,
    toggleHighContrast,
    toggleLargeText,
    toggleReduceMotion,
    toggleCaptions,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 left-6 z-[1000] flex flex-col items-start gap-2">
      {isOpen && (
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl shadow-lg p-3 space-y-2 w-56">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Accessibility</div>
          <button
            onClick={toggleFocusMode}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border ${
              focusMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
            aria-pressed={focusMode}
          >
            Focus Mode
          </button>
          <button
            onClick={toggleHighContrast}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border ${
              highContrast ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
            aria-pressed={highContrast}
          >
            High Contrast
          </button>
          <button
            onClick={toggleLargeText}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border ${
              largeText ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
            aria-pressed={largeText}
          >
            Large Text
          </button>
          <button
            onClick={toggleReduceMotion}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border ${
              reduceMotion ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
            aria-pressed={reduceMotion}
          >
            Reduce Motion
          </button>
          <button
            onClick={toggleCaptions}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium border ${
              captionsOn ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'
            } disabled:opacity-60`}
            aria-pressed={captionsOn}
            disabled={!!deaf}
          >
            Captions {deaf ? '(locked)' : ''}
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center hover:bg-slate-800"
        aria-expanded={isOpen}
        aria-label="Toggle accessibility settings"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-5.5 5.5h11M12 10.5v8m-3.5-5.5L6 20m9.5-7.5L18 20"
          />
        </svg>
      </button>
    </div>
  );
};
