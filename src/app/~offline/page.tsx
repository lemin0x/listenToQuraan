import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 text-center">
      <h1 className="text-2xl font-semibold text-primary">You're Offline</h1>
      <p className="mt-2 text-secondary">
        Some content may not be available without an internet connection.
        Previously played audio files are available offline.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Go Home
      </Link>
    </div>
  );
}
