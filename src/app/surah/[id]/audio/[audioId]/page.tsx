import { getRecording } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';

type Props = { params: Promise<{ id: string; audioId: string }> };

export async function generateMetadata({ params }: Props) {
  const { id, audioId } = await params;
  const result = await getRecording(Number(id), audioId);
  if (!result) return { title: 'Not Found' };
  return {
    title: `${result.recording.title} - ${result.surah.nameEnglish} - Quran Audio`,
    description: `Listen to ${result.recording.title} of ${result.surah.nameEnglish} by ${result.recording.reciter}`,
  };
}

export default async function AudioPage({ params }: Props) {
  const { id, audioId } = await params;
  const result = await getRecording(Number(id), audioId);
  if (!result) notFound();
  redirect(`/surah/${id}`);
}
