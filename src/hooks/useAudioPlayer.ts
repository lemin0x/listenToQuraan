'use client';
import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { getAudioUrl } from '@/lib/audio-source';
import type { AudioRecording } from '@/lib/types';

let audioElement: HTMLAudioElement | null = null;
let lastSrcRef = '';

export function getAudio(): HTMLAudioElement {
  if (typeof window === 'undefined') {
    throw new Error('Audio is not available on the server');
  }
    if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = 'metadata';
  }
  return audioElement;
}

function setupMediaSession(
  title: string,
  reciter: string,
  surahName: string,
  duration: number,
): void {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist: reciter,
    album: surahName,
  });
  if (duration > 0) {
    navigator.mediaSession.setPositionState?.({ duration, playbackRate: 1, position: 0 });
  }
}

function updateMediaSessionPosition(time: number, duration: number, rate: number): void {
  if (!('mediaSession' in navigator)) return;
  if (!isFinite(duration) || duration <= 0) return;
  navigator.mediaSession.setPositionState?.({ duration, playbackRate: rate, position: time });
}

export function playRecording(recording: AudioRecording, surahId: number, surahName: string): void {
  const store = usePlayerStore.getState();
  const current = store.currentRecording;
  const audio = getAudio();

  if (current?.id === recording.id && current.audioUrl === recording.audioUrl) {
    store.setAutoplayBlocked(false);
    if (store.isPlaying) {
      audio.pause();
      store.pause();
    } else {
      store.togglePlay();
      const p = audio.play();
      if (p !== undefined) p.catch((err) => {
        if (err.name === 'NotAllowedError') {
          store.setAutoplayBlocked(true);
        }
      });
    }
    return;
  }

  store.play(recording, surahId, surahName);
  const url = getAudioUrl(recording);

  if (url !== lastSrcRef) {
    audio.src = url;
    audio.load();
    lastSrcRef = url;
  } else {
    audio.currentTime = 0;
  }

  function playWithGuard() {
    const p = audio.play();
    if (p !== undefined) p.catch((err) => {
      if (err.name === 'NotAllowedError') {
        usePlayerStore.getState().setAutoplayBlocked(true);
      }
    });
  }

  if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    playWithGuard();
  } else {
    audio.addEventListener('canplay', playWithGuard, { once: true });
  }
}

export function togglePlayback(): void {
  const store = usePlayerStore.getState();
  const audio = getAudio();
  if (store.isPlaying) {
    audio.pause();
    store.pause();
  } else {
    store.togglePlay();
    const p = audio.play();
    if (p !== undefined) p.catch((err) => {
      if (err.name === 'NotAllowedError') {
        store.setAutoplayBlocked(true);
      }
    });
  }
}

export function useAudioPlayer() {
  const currentRecording = usePlayerStore((s) => s.currentRecording);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playbackRate = usePlayerStore((s) => s.playbackRate);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const pointA = usePlayerStore((s) => s.pointA);
  const pointB = usePlayerStore((s) => s.pointB);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setLoading = usePlayerStore((s) => s.setLoading);
  const setAutoplayBlocked = usePlayerStore((s) => s.setAutoplayBlocked);
  const pause = usePlayerStore((s) => s.pause);
  const seekingRef = useRef(false);
  const currentRecordingRef = useRef(currentRecording);
  const repeatConfigRef = useRef({ repeatMode, pointA, pointB });

  currentRecordingRef.current = currentRecording;
  useEffect(() => { repeatConfigRef.current = { repeatMode, pointA, pointB }; }, [repeatMode, pointA, pointB]);

  useEffect(() => {
    let audio: HTMLAudioElement;
    try { audio = getAudio(); } catch { return; }

    function handleTimeUpdate() {
      if (seekingRef.current) return;
      setCurrentTime(audio.currentTime);
      updateMediaSessionPosition(audio.currentTime, audio.duration, audio.playbackRate);
      const { repeatMode: mode, pointA: a, pointB: b } = repeatConfigRef.current;
      if (mode === 'ab-repeat' && a !== null && b !== null && audio.currentTime >= b) {
        audio.currentTime = a;
      }
    }

    function handleLoadedMetadata() {
      setDuration(audio.duration);
      setLoading(false);
      const rec = currentRecordingRef.current;
      if (rec) {
        setupMediaSession(
          rec.title,
          rec.reciter,
          usePlayerStore.getState().surahName ?? '',
          audio.duration,
        );
      }
    }

    function handleEnded() {
      const { repeatMode: mode } = repeatConfigRef.current;
      if (mode === 'loop') {
        audio.currentTime = 0;
        const p = audio.play();
        if (p !== undefined) p.catch((err) => {
          if (err.name === 'NotAllowedError') {
            setAutoplayBlocked(true);
          }
        });
      } else {
        pause();
        setCurrentTime(0);
      }
    }

    function handleError() {
      setLoading(false);
    }

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [setCurrentTime, setDuration, setLoading, setAutoplayBlocked, pause]);

  useEffect(() => {
    let audio: HTMLAudioElement;
    try { audio = getAudio(); } catch { return; }
    if (audio.playbackRate !== playbackRate) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.target instanceof HTMLButtonElement && e.target !== document.body) return;
      if (e.code === 'Space' && currentRecording) {
        e.preventDefault();
        togglePlayback();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentRecording]);

  const seek = useCallback((time: number) => {
    let audio: HTMLAudioElement;
    try { audio = getAudio(); } catch { return; }
    seekingRef.current = true;
    audio.currentTime = time;
    setCurrentTime(time);
    queueMicrotask(() => { seekingRef.current = false; });
  }, [setCurrentTime]);

  const skipBackward = useCallback(() => {
    let audio: HTMLAudioElement;
    try { audio = getAudio(); } catch { return; }
    seek(Math.max(audio.currentTime - 15, 0));
  }, [seek]);

  const skipForward = useCallback(() => {
    let audio: HTMLAudioElement;
    try { audio = getAudio(); } catch { return; }
    seek(Math.min(audio.currentTime + 15, audio.duration || 0));
  }, [seek]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const actionHandlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => { usePlayerStore.getState().togglePlay(); }],
      ['pause', () => { usePlayerStore.getState().pause(); }],
      ['seekbackward', () => {
        const audio = getAudio();
        seek(Math.max(audio.currentTime - 15, 0));
      }],
      ['seekforward', () => {
        const audio = getAudio();
        seek(Math.min(audio.currentTime + 15, audio.duration || 0));
      }],
      ['seekto', (details) => {
        if (details.seekTime != null) seek(details.seekTime);
      }],
    ];
    for (const [action, handler] of actionHandlers) {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
    }
    return () => {
      for (const [action] of actionHandlers) {
        try { navigator.mediaSession.setActionHandler(action, null); } catch {}
      }
    };
  }, [seek]);

  return { seek, skipBackward, skipForward };
}
