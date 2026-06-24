import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from './playerStore';
import type { AudioRecording } from '@/lib/types';

const mockRecording: AudioRecording = {
  id: 'test-1',
  title: 'Test Recording',
  reciter: 'Test Reciter',
  audioUrl: '/audio/test.mp3',
};

const mockRecording2: AudioRecording = {
  id: 'test-2',
  title: 'Test Recording 2',
  reciter: 'Test Reciter 2',
  audioUrl: '/audio/test2.mp3',
};

describe('playerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({
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
    });
  });

  describe('play', () => {
    it('sets current recording and marks as playing', () => {
      usePlayerStore.getState().play(mockRecording, 1, 'Al-Fatiha');
      const state = usePlayerStore.getState();
      expect(state.currentRecording).toEqual(mockRecording);
      expect(state.surahId).toBe(1);
      expect(state.surahName).toBe('Al-Fatiha');
      expect(state.isPlaying).toBe(true);
      expect(state.isLoading).toBe(true);
    });

    it('resets time, duration, and repeat on new recording', () => {
      usePlayerStore.setState({ currentTime: 50, duration: 200, repeatMode: 'loop', pointA: 10, pointB: 20 });
      usePlayerStore.getState().play(mockRecording, 1, 'Al-Fatiha');
      const state = usePlayerStore.getState();
      expect(state.currentTime).toBe(0);
      expect(state.duration).toBe(0);
      expect(state.repeatMode).toBe('off');
      expect(state.pointA).toBeNull();
      expect(state.pointB).toBeNull();
    });

    it('toggles play if same recording is already set', () => {
      usePlayerStore.getState().play(mockRecording, 1, 'Al-Fatiha');
      usePlayerStore.setState({ isPlaying: false });
      usePlayerStore.getState().play(mockRecording, 1, 'Al-Fatiha');
      expect(usePlayerStore.getState().isPlaying).toBe(true);
    });
  });

  describe('pause / togglePlay', () => {
    it('pauses playback', () => {
      usePlayerStore.setState({ isPlaying: true });
      usePlayerStore.getState().pause();
      expect(usePlayerStore.getState().isPlaying).toBe(false);
    });

    it('toggles play state', () => {
      usePlayerStore.setState({ isPlaying: false });
      usePlayerStore.getState().togglePlay();
      expect(usePlayerStore.getState().isPlaying).toBe(true);
      usePlayerStore.getState().togglePlay();
      expect(usePlayerStore.getState().isPlaying).toBe(false);
    });
  });

  describe('setPointA / setPointB', () => {
    it('validates pointA < pointB', () => {
      usePlayerStore.setState({ pointB: 100 });
      usePlayerStore.getState().setPointA(150);
      expect(usePlayerStore.getState().pointA).toBe(99.9);
    });

    it('validates pointB > pointA', () => {
      usePlayerStore.setState({ pointA: 100 });
      usePlayerStore.getState().setPointB(50);
      expect(usePlayerStore.getState().pointB).toBe(100.1);
    });

    it('sets pointA when pointB is null', () => {
      usePlayerStore.getState().setPointA(50);
      expect(usePlayerStore.getState().pointA).toBe(50);
    });

    it('sets pointB when pointA is null', () => {
      usePlayerStore.getState().setPointB(50);
      expect(usePlayerStore.getState().pointB).toBe(50);
    });

    it('clears pointA with null', () => {
      usePlayerStore.setState({ pointA: 50 });
      usePlayerStore.getState().setPointA(null);
      expect(usePlayerStore.getState().pointA).toBeNull();
    });
  });

  describe('clearRepeat', () => {
    it('clears points and repeat mode', () => {
      usePlayerStore.setState({ pointA: 10, pointB: 20, repeatMode: 'ab-repeat' });
      usePlayerStore.getState().clearRepeat();
      const state = usePlayerStore.getState();
      expect(state.pointA).toBeNull();
      expect(state.pointB).toBeNull();
      expect(state.repeatMode).toBe('off');
    });
  });

  describe('toggleFullScreen', () => {
    it('toggles fullscreen state', () => {
      expect(usePlayerStore.getState().isFullScreen).toBe(false);
      usePlayerStore.getState().toggleFullScreen();
      expect(usePlayerStore.getState().isFullScreen).toBe(true);
      usePlayerStore.getState().toggleFullScreen();
      expect(usePlayerStore.getState().isFullScreen).toBe(false);
    });
  });

  describe('stop', () => {
    it('resets all state', () => {
      usePlayerStore.setState({
        currentRecording: mockRecording, surahId: 1, surahName: 'Test',
        isPlaying: true, currentTime: 50, isFullScreen: true,
      });
      usePlayerStore.getState().stop();
      const state = usePlayerStore.getState();
      expect(state.currentRecording).toBeNull();
      expect(state.surahId).toBeNull();
      expect(state.surahName).toBeNull();
      expect(state.isPlaying).toBe(false);
      expect(state.currentTime).toBe(0);
      expect(state.isFullScreen).toBe(false);
    });
  });

  describe('setPlaybackRate', () => {
    it('sets playback rate', () => {
      usePlayerStore.getState().setPlaybackRate(1.5);
      expect(usePlayerStore.getState().playbackRate).toBe(1.5);
    });
  });

  describe('setAutoplayBlocked', () => {
    it('sets autoplay blocked state', () => {
      usePlayerStore.getState().setAutoplayBlocked(true);
      expect(usePlayerStore.getState().autoplayBlocked).toBe(true);
    });
  });
});
