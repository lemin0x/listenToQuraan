import { getSurahs } from '@/lib/data';
import { SurahCard } from '@/components/SurahCard';

export default async function Home() {
  const surahs = await getSurahs();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-primary">Surahs</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {surahs.map((surah) => (
          <SurahCard key={surah.id} surah={surah} />
        ))}
      </div>
    </div>
  );
}
