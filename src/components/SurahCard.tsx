import Link from 'next/link';
import type { Surah } from '@/lib/types';

export function SurahCard({ surah }: { surah: Surah }) {
  const count = surah.audios.length;

  return (
    <Link
      href={`/surah/${surah.id}`}
      className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/30 hover:bg-elevated"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-elevated text-sm font-semibold text-secondary">
          {surah.id}
        </span>
        <div>
          <h2 className="text-base font-medium text-primary">{surah.nameEnglish}</h2>
          <p className="text-lg leading-none text-highlight" dir="rtl">
            {surah.nameArabic}
          </p>
        </div>
      </div>
      {count > 0 && (
        <span className="shrink-0 text-sm text-secondary">
          {count} {count === 1 ? 'recording' : 'recordings'}
        </span>
      )}
    </Link>
  );
}
