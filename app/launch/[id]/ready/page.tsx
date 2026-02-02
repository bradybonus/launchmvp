"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLaunch } from "@/lib/context/LaunchContext";

export default function ReadyToLaunchPage() {
  const params = useParams();
  const id = params.id as string;
  const { getLaunchById, confirmLaunch } = useLaunch();
  const launch = getLaunchById(id);
  const [confirmed, setConfirmed] = useState(false);

  if (!launch) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-gray-600">Launch not found.</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  function handleConfirm() {
    if (!launch) return;
    confirmLaunch(launch.id);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm text-center max-w-md w-full">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Launch activated
          </h2>
          <p className="mt-2 text-gray-600">
            All teams have been notified. {launch.name} is now live.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  let total = 0;
  let done = 0;
  for (const section of launch.plan.sections) {
    for (const task of section.tasks) {
      total++;
      if (task.status === "done") done++;
    }
  }
  const allComplete = total > 0 && done === total;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Launch
          </Link>
          <Link href={`/launch/${launch.id}`} className="text-sm text-gray-600 hover:text-gray-900">
            Back to launch plan
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Ready to Launch</h1>
        <p className="mt-1 text-gray-600">
          Final review for {launch.name}. Confirm when you’re ready to go live.
        </p>
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">All sections complete</p>
              <p className="text-sm text-gray-500">
                {done} of {total} tasks done. Launch plan is ready.
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              Confirming will mark this launch as live and notify stakeholders. This is a simulated action in the prototype.
            </p>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!allComplete}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Launch
            </button>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href={`/launch/${launch.id}`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to launch plan
          </Link>
        </div>
      </main>
    </div>
  );
}
