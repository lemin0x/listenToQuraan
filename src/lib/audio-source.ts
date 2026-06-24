import type { AudioRecording } from './types';

const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_BASE_URL;

export function getAudioUrl(recording: AudioRecording): string {
  if (R2_BASE_URL) {
    const path = recording.audioUrl.replace(/^\//, '');
    return `${R2_BASE_URL}/${path}`;
  }
  return recording.audioUrl;
}
