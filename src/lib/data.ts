import type { Surah } from './types';
import { promises as fs } from 'fs';
import path from 'path';

let cachedSurahs: Surah[] | null = null;

export async function getSurahs(): Promise<Surah[]> {
  if (cachedSurahs) return cachedSurahs;

  if (typeof window === 'undefined') {
    const filePath = path.join(process.cwd(), 'public', 'data', 'surahs.json');
    const contents = await fs.readFile(filePath, 'utf-8');
    const data: Surah[] = JSON.parse(contents);
    cachedSurahs = data;
    return data;
  }

  const res = await fetch('/data/surahs.json');
  if (!res.ok) throw new Error('Failed to load surahs data');
  const data: Surah[] = await res.json();
  cachedSurahs = data;
  return data;
}

export async function getSurah(id: number): Promise<Surah | undefined> {
  const surahs = await getSurahs();
  return surahs.find((s) => s.id === id);
}

export async function getRecording(
  surahId: number,
  audioId: string,
): Promise<{ surah: Surah; recording: Surah['audios'][number] } | undefined> {
  const surah = await getSurah(surahId);
  if (!surah) return undefined;
  const recording = surah.audios.find((a) => a.id === audioId);
  if (!recording) return undefined;
  return { surah, recording };
}
