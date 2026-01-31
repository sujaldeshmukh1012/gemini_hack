import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StoryAsset, StorySlide } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useAccessibility } from './accessibility/AccessibilityProvider';

interface StoryPlayerProps {
  story: StoryAsset;
  autoPlay?: boolean;
}

const estimateDurationMs = (text: string, rate: number) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 150 * rate;
  const minutes = words / Math.max(wordsPerMinute, 1);
  return Math.max(4500, minutes * 60 * 1000);
};

const slugifyKeyword = (keyword: string) => {
  return keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

export const StoryPlayer = ({ story, autoPlay = false }: StoryPlayerProps) => {
  const { captionsOn } = useAccessibility();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const timerRef = useRef<number | null>(null);

  const slides = story.slides || [];
  const currentSlide = slides[currentIndex];
  const mediaBaseUrl = 'http://localhost:8000';

  const {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isPaused,
    currentRate,
  } = useTextToSpeech({ rate: 1 });

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const playSlide = useCallback(
    (slide: StorySlide) => {
      speak(slide.narration);
      clearTimer();
      const duration = estimateDurationMs(slide.narration, currentRate);
      timerRef.current = window.setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev < slides.length - 1) return prev + 1;
          setIsAutoPlaying(false);
          return prev;
        });
      }, duration);
    },
    [currentRate, speak, slides.length]
  );

  useEffect(() => {
    if (isAutoPlaying && currentSlide) {
      playSlide(currentSlide);
    }

    return () => clearTimer();
  }, [isAutoPlaying, currentIndex, currentSlide, playSlide]);

  useEffect(() => {
    return () => {
      clearTimer();
      stop();
    };
  }, [stop]);

  if (!currentSlide) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
        Story content not available.
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      role="region"
      aria-label="Story mode player"
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Story Mode</p>
          <h3 className="text-lg font-semibold text-slate-900">{currentSlide.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100"
            onClick={() => {
              setIsAutoPlaying(false);
              clearTimer();
              pause();
            }}
            aria-label="Pause narration"
          >
            Pause
          </button>
          <button
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100"
            onClick={() => {
              setIsAutoPlaying(true);
              if (isPaused) resume();
            }}
            aria-label="Play narration"
          >
            Play
          </button>
          <button
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100"
            onClick={() => {
              setIsAutoPlaying(false);
              clearTimer();
              stop();
            }}
            aria-label="Stop narration"
          >
            Stop
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="aspect-[16/9] bg-slate-900 flex items-center justify-center">
          {currentSlide.imageUrl ? (
            <img
              src={
                currentSlide.imageUrl.startsWith('/media')
                  ? `${mediaBaseUrl}${currentSlide.imageUrl}`
                  : currentSlide.imageUrl
              }
              alt={currentSlide.caption}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-400">Image not available</div>
          )}
        </div>

        {captionsOn && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-4 py-3 text-sm"
            aria-live="polite"
          >
            {currentSlide.caption}
          </div>
        )}
      </div>

      {currentSlide.signKeywords && currentSlide.signKeywords.length > 0 && (
        <div className="flex flex-wrap gap-3 p-4 border-t border-slate-200 bg-slate-50">
          {currentSlide.signKeywords.map((keyword) => {
            const slug = slugifyKeyword(keyword);
            const src = `/signs/${slug}.png`;
            return (
              <div key={keyword} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                <img
                  src={src}
                  alt={`Sign for ${keyword}`}
                  className="w-10 h-10 object-contain"
                  onError={(event) => {
                    const target = event.currentTarget;
                    target.style.display = 'none';
                  }}
                />
                <span className="text-sm text-slate-700">{keyword}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between p-4 border-t border-slate-200">
        <button
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100"
          onClick={() => {
            setIsAutoPlaying(false);
            clearTimer();
            stop();
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
          }}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <div className="text-sm text-slate-500">
          Slide {currentIndex + 1} of {slides.length}
        </div>
        <button
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100"
          onClick={() => {
            setIsAutoPlaying(false);
            clearTimer();
            stop();
            setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
          }}
          disabled={currentIndex >= slides.length - 1}
        >
          Next
        </button>
      </div>

      <div className="px-6 pb-6">
        <p className="text-slate-600 leading-relaxed">{currentSlide.narration}</p>
      </div>

      <div className="px-6 pb-6 text-xs text-slate-400">
        {isPlaying && !isPaused && isAutoPlaying ? "Auto-playing" : "Manual navigation"}
      </div>
    </div>
  );
};
