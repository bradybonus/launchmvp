"use client";

import Link from "next/link";

export default function TaskDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm text-center max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-gray-600">
          This task view couldn’t load. You can go back to the launch plan or dashboard.
        </p>
        {process.env.NODE_ENV === "development" && error?.message && (
          <pre className="mt-3 overflow-auto rounded bg-gray-100 p-3 text-left text-xs text-red-700">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
