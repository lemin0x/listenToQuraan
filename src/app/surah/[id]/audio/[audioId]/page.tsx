import { getRecording } from '@/lib/data';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string; audioId: string }>;
};

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">{result.recording.title}</h1>
        <p className="text-lg text-highlight" dir="rtl">
          {result.surah.nameArabic}
        </p>
        <p className="text-sm text-secondary">{result.recording.reciter}</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-secondary">
          Use the persistent player at the bottom of the screen to control playback.
        </p>
      </div>
    </div>
  );
}
