'use client';

import { create } from 'zustand';
import type { AudioRecording, RepeatMode } from '@/lib/types';

interface PlayerState {
  currentRecording: AudioRecording | null;
  surahId: number | null;
  surahName: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  repeatMode: RepeatMode;
  pointA: number | null;
  pointB: number | null;
  isFullScreen: boolean;
  isLoading: boolean;

  play: (recording: AudioRecording, surahId: number, surahName: string) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setPointA: (time: number | null) => void;
  setPointB: (time: number | null) => void;
  clearRepeat: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  toggleFullScreen: () => void;
  setLoading: (loading: boolean) => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentRecording: null,
  surahId: null,
  surahName: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  repeatMode: 'off',
  pointA: null,
  pointB: null,
  isFullScreen: false,
  isLoading: false,

  play: (recording, surahId, surahName) => {
    const current = get().currentRecording;
    if (current?.id === recording.id && current.audioUrl === recording.audioUrl) {
      set({ isPlaying: true });
      return;
    }
    set({
      currentRecording: recording,
      surahId,
      surahName,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      repeatMode: 'off',
      pointA: null,
      pointB: null,
      isFullScreen: false,
      isLoading: true,
    });
  },

  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  seek: (time) => set({ currentTime: time }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration, isLoading: false }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  setPointA: (time) => set({ pointA: time }),
  setPointB: (time) => set({ pointB: time }),
  clearRepeat: () => set({ pointA: null, pointB: null, repeatMode: 'off' }),

  skipForward: () => {
    const { currentTime, duration } = get();
    set({ currentTime: Math.min(currentTime + 15, duration) });
  },

  skipBackward: () => {
    const { currentTime } = get();
    set({ currentTime: Math.max(currentTime - 15, 0) });
  },

  toggleFullScreen: () => set((s) => ({ isFullScreen: !s.isFullScreen })),
  setLoading: (loading) => set({ isLoading: loading }),

  stop: () =>
    set({
      currentRecording: null,
      surahId: null,
      surahName: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
    }),
}));
