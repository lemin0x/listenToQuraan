export type AudioRecording = {
  id: string;
  title: string;
  reciter: string;
  audioUrl: string;
  duration?: number;
};

export type Surah = {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  audios: AudioRecording[];
};

export type RepeatMode = 'off' | 'loop' | 'ab-repeat';

export type SavedSegment = {
  id: string;
  recordingId: string;
  surahId: number;
  surahName: string;
  label: string;
  pointA: number;
  pointB: number;
  createdAt: number;
};
