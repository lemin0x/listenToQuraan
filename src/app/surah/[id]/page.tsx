import { getSurah } from '@/lib/data';
import { notFound } from 'next/navigation';
import { RecordingCard } from '@/components/RecordingCard';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const surah = await getSurah(Number(id));
  if (!surah) return { title: 'Not Found' };
  return {
    title: `${surah.nameEnglish} - Quran Audio`,
    description: `Listen to ${surah.nameEnglish} recordings`,
  };
}

export default async function SurahPage({ params }: Props) {
  const { id } = await params;
  const surah = await getSurah(Number(id));

  if (!surah) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">{surah.nameEnglish}</h1>
        <p className="text-xl text-highlight" dir="rtl">
          {surah.nameArabic}
        </p>
        {surah.audios.length > 0 && (
          <p className="mt-1 text-sm text-secondary">
            {surah.audios.length} {surah.audios.length === 1 ? 'recording' : 'recordings'} available
          </p>
        )}
      </div>

      {surah.audios.length > 0 ? (
        <div className="space-y-2">
          {surah.audios.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              surahId={surah.id}
              surahName={surah.nameEnglish}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-secondary">No recordings available yet</p>
        </div>
      )}
    </div>
  );
}
