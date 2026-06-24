import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-base/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          Quran Audio
        </Link>
      </div>
    </header>
  );
}
