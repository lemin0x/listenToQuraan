'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { useSegmentsStore } from '@/stores/segmentsStore';
import { formatTime } from '@/lib/utils';
import { CloseIcon } from './icons/CloseIcon';

export function SavedSegments() {
  const currentRecording = usePlayerStore((s) => s.currentRecording);
  const setPointA = usePlayerStore((s) => s.setPointA);
  const setPointB = usePlayerStore((s) => s.setPointB);
  const setRepeatMode = usePlayerStore((s) => s.setRepeatMode);
  const pointA = usePlayerStore((s) => s.pointA);
  const pointB = usePlayerStore((s) => s.pointB);
  const addSegment = useSegmentsStore((s) => s.addSegment);
  const removeSegment = useSegmentsStore((s) => s.removeSegment);
  const segments = useSegmentsStore((s) => s.segments);

  const recordingSegments = segments.filter(
    (s) => s.recordingId === currentRecording?.id,
  );
  const canSave = pointA !== null && pointB !== null && pointA < pointB && currentRecording;

  return (
    <div className="space-y-3">
      {canSave && (
        <button
          onClick={() =>
            addSegment({
              recordingId: currentRecording!.id,
              surahId: usePlayerStore.getState().surahId!,
              surahName: usePlayerStore.getState().surahName!,
              label: `Segment ${recordingSegments.length + 1}`,
              pointA: pointA!,
              pointB: pointB!,
            })
          }
          className="w-full rounded-lg border border-dashed border-accent/40 px-3 py-2 text-center text-sm text-accent transition-colors hover:border-accent hover:text-accent-hover"
        >
          Save Current A-B Segment
        </button>
      )}

      {recordingSegments.length === 0 && !canSave && (
        <p className="text-center text-xs text-secondary">
          Set points A and B to save a segment
        </p>
      )}

      {recordingSegments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-secondary">Saved Segments</p>
          {recordingSegments.map((seg) => (
            <div
              key={seg.id}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
            >
              <button
                onClick={() => {
                  setPointA(seg.pointA);
                  setPointB(seg.pointB);
                  setRepeatMode('ab-repeat');
                }}
                className="min-w-0 flex-1 text-left text-sm text-primary hover:text-accent"
              >
                <span className="block truncate text-xs text-secondary">{seg.label}</span>
                <span className="text-xs text-secondary">
                  {formatTime(seg.pointA)} – {formatTime(seg.pointB)}
                </span>
              </button>
              <button
                onClick={() => removeSegment(seg.id)}
                className="shrink-0 rounded p-1 text-secondary transition-colors hover:text-danger"
                aria-label={`Delete ${seg.label}`}
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
