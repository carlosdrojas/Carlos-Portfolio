'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#2A2E35] px-6 text-center text-[#E8E4DA]">
      <h1 className="text-xl font-semibold">Something went wrong loading this page.</h1>
      <div className="flex gap-4">
        <button type="button" onClick={reset} className="underline underline-offset-4">
          Try again
        </button>
        <Link href="/classic" className="underline underline-offset-4">
          View the classic site
        </Link>
      </div>
    </main>
  );
}
