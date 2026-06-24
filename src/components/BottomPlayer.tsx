'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { MiniPlayer } from './MiniPlayer';
import { FullScreenPlayer } from './FullScreenPlayer';

export function BottomPlayer() {
  const currentRecording = usePlayerStore((s) => s.currentRecording);
  const isFullScreen = usePlayerStore((s) => s.isFullScreen);
  const { seek, skipBackward, skipForward } = useAudioPlayer();

  if (!currentRecording) return null;

  return (
    <>
      {!isFullScreen && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <MiniPlayer onSeek={seek} onSkipBack={skipBackward} onSkipForward={skipForward} />
        </div>
      )}
      {isFullScreen && (
        <FullScreenPlayer onSeek={seek} onSkipBack={skipBackward} onSkipForward={skipForward} />
      )}
    </>
  );
}
