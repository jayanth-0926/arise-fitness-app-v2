import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-6 text-center">
      <p className="font-display text-6xl text-accent-red">404</p>
      <h1 className="mt-4 font-display text-3xl">PAGE NOT FOUND</h1>
      <p className="mt-2 text-text-secondary">The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-sm bg-accent-red px-6 py-3 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover"
      >
        BACK HOME
      </Link>
    </main>
  );
}
