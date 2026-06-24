'use client';
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { ProgressBar } from './ProgressBar';
import { TransportControls } from './TransportControls';
import { SpeedControl } from './SpeedControl';
import { RepeatControls } from './RepeatControls';
import { SavedSegments } from './SavedSegments';
import { CloseIcon } from './icons/CloseIcon';

type Props = {
  onSeek: (time: number) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
};

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function FullScreenPlayer({ onSeek, onSkipBack, onSkipForward }: Props) {
  const currentRecording = usePlayerStore((s) => s.currentRecording);
  const isFullScreen = usePlayerStore((s) => s.isFullScreen);
  const toggleFullScreen = usePlayerStore((s) => s.toggleFullScreen);
  const surahName = usePlayerStore((s) => s.surahName);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFullScreen) return;
    const container = containerRef.current;
    if (!container) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable.length > 0) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      prevFocus?.focus();
    };
  }, [isFullScreen]);

  if (!currentRecording || !isFullScreen) return null;
  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col bg-base">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-secondary">{surahName}</span>
        <button onClick={toggleFullScreen} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:text-primary" aria-label="Close player">
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-primary">{currentRecording.title}</p>
          <p className="mt-1 text-sm text-secondary">{currentRecording.reciter}</p>
        </div>
        <ProgressBar onSeek={onSeek} />
        <TransportControls onSkipBack={onSkipBack} onSkipForward={onSkipForward} size="lg" />
        <SpeedControl />
        <RepeatControls />
        <div className="w-full max-w-sm">
          <SavedSegments />
        </div>
      </div>
    </div>
  );
}
