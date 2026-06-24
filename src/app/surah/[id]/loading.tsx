export default function SurahLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-elevated" />
        <div className="mt-2 h-7 w-32 animate-pulse rounded bg-elevated" />
        <div className="mt-3 h-4 w-28 animate-pulse rounded bg-elevated" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}
