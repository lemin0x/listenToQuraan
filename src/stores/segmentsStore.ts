'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedSegment } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface SegmentsState {
  segments: SavedSegment[];
  addSegment: (segment: Omit<SavedSegment, 'id' | 'createdAt'>) => void;
  removeSegment: (id: string) => void;
  getSegmentsForRecording: (recordingId: string) => SavedSegment[];
}

export const useSegmentsStore = create<SegmentsState>()(
  persist(
    (set, get) => ({
      segments: [],

      addSegment: (segment) =>
        set((s) => ({
          segments: [
            ...s.segments,
            {
              ...segment,
              id: generateId(),
              createdAt: Date.now(),
            },
          ],
        })),

      removeSegment: (id) =>
        set((s) => ({
          segments: s.segments.filter((seg) => seg.id !== id),
        })),

      getSegmentsForRecording: (recordingId) =>
        get().segments.filter((seg) => seg.recordingId === recordingId),
    }),
    {
      name: 'listen-segments',
    },
  ),
);
