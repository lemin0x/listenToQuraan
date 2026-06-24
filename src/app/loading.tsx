export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-24 animate-pulse rounded bg-elevated" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}
