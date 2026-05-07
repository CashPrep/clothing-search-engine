'use client';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-zinc-400 mb-6">{error.message}</p>
        <button onClick={reset} className="rounded-xl bg-white text-black px-6 py-3 font-medium hover:bg-zinc-200">
          Try again
        </button>
      </div>
    </div>
  );
}
