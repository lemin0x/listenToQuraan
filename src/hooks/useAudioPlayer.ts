'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { getAudioUrl } from '@/lib/audio-source';

let audioElement: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = 'metadata';
  }
  return audioElement;
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
  const pause = usePlayerStore((s) => s.pause);

  const seekingRef = useRef(false);
  const repeatConfigRef = useRef({ repeatMode, pointA, pointB });

  useEffect(() => {
    repeatConfigRef.current = { repeatMode, pointA, pointB };
  }, [repeatMode, pointA, pointB]);

  useEffect(() => {
    const audio = getAudio();

    const onTimeUpdate = () => {
      if (seekingRef.current) return;
      setCurrentTime(audio.currentTime);

      const { repeatMode: mode, pointA: a, pointB: b } = repeatConfigRef.current;
      if (mode === 'ab-repeat' && a !== null && b !== null) {
        if (audio.currentTime >= b) {
          audio.currentTime = a;
        }
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const onEnded = () => {
      const { repeatMode: mode } = repeatConfigRef.current;
      if (mode === 'loop') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        pause();
        setCurrentTime(0);
      }
    };

    const onError = () => setLoading(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [setCurrentTime, setDuration, setLoading, pause]);

  useEffect(() => {
    if (!currentRecording) return;
    const audio = getAudio();
    const url = getAudioUrl(currentRecording);

    if (audio.src !== url) {
      setLoading(true);
      audio.src = url;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentRecording]);

  useEffect(() => {
    const audio = getAudio();
    if (!audio.src || !currentRecording) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentRecording]);

  useEffect(() => {
    const audio = getAudio();
    if (audio.playbackRate !== playbackRate) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const seek = useCallback((time: number) => {
    const audio = getAudio();
    seekingRef.current = true;
    audio.currentTime = time;
    setCurrentTime(time);
    seekingRef.current = false;
  }, [setCurrentTime]);

  const skipBackward = useCallback(() => {
    const audio = getAudio();
    seek(Math.max(audio.currentTime - 15, 0));
  }, [seek]);

  const skipForward = useCallback(() => {
    const audio = getAudio();
    seek(Math.min(audio.currentTime + 15, audio.duration || 0));
  }, [seek]);

  return { seek, skipBackward, skipForward };
}
