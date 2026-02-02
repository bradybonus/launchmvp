"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm text-center max-w-lg w-full">
        <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-gray-600">
          The app hit an error. You can try again or go back to the dashboard.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 text-left text-xs text-red-600 overflow-auto max-h-32 p-3 bg-red-50 rounded">
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
