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
  autoplayBlocked: boolean;
  play: (recording: AudioRecording, surahId: number, surahName: string) => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setPointA: (time: number | null) => void;
  setPointB: (time: number | null) => void;
  clearRepeat: () => void;
  toggleFullScreen: () => void;
  setLoading: (loading: boolean) => void;
  setAutoplayBlocked: (blocked: boolean) => void;
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
  autoplayBlocked: false,
  play: (recording, surahId, surahName) => {
    const current = get().currentRecording;
    if (current?.id === recording.id && current.audioUrl === recording.audioUrl) {
      set({ isPlaying: true, autoplayBlocked: false });
      return;
    }
    set({
      currentRecording: recording, surahId, surahName, isPlaying: true,
      currentTime: 0, duration: 0, repeatMode: 'off',
      pointA: null, pointB: null, isFullScreen: false, isLoading: true,
      autoplayBlocked: false,
    });
  },
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => {
    if (s.autoplayBlocked) return { autoplayBlocked: false, isPlaying: !s.isPlaying };
    return { isPlaying: !s.isPlaying };
  }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration, isLoading: false }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  setPointA: (time) => set((s) => {
    if (time === null) return { pointA: null };
    if (s.pointB !== null && time >= s.pointB) return { pointA: s.pointB - 0.1 };
    return { pointA: time };
  }),
  setPointB: (time) => set((s) => {
    if (time === null) return { pointB: null };
    if (s.pointA !== null && time <= s.pointA) return { pointB: s.pointA + 0.1 };
    return { pointB: time };
  }),
  clearRepeat: () => set({ pointA: null, pointB: null, repeatMode: 'off' }),
  toggleFullScreen: () => set((s) => ({ isFullScreen: !s.isFullScreen })),
  setLoading: (loading) => set({ isLoading: loading }),
  setAutoplayBlocked: (blocked) => set({ autoplayBlocked: blocked }),
  stop: () => set({
    currentRecording: null, surahId: null, surahName: null,
    isPlaying: false, currentTime: 0, duration: 0, isFullScreen: false,
    autoplayBlocked: false,
  }),
}));
