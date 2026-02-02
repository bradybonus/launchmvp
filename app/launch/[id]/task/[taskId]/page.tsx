"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const TaskDetailClient = dynamic(
  () => import("./TaskDetailClient").then((m) => m.TaskDetailClient),
  { ssr: false, loading: () => <TaskDetailLoading /> }
);

function TaskDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      <p className="mt-4 text-sm text-gray-500">Loading...</p>
    </div>
  );
}

export default function TaskDetailPage() {
  const [parsed, setParsed] = useState<{ launchId: string; itemId: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/launch\/([^/]+)\/task\/([^/]+)/);
    if (match) {
      setParsed({ launchId: match[1], itemId: match[2] });
    } else {
      setParsed({ launchId: "", itemId: "" });
    }
  }, []);

  if (parsed === null) {
    return <TaskDetailLoading />;
  }

  const { launchId, itemId } = parsed;
  if (!launchId || !itemId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-gray-500">Invalid link. Missing launch or item.</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline text-sm">
          Dashboard
        </Link>
      </div>
    );
  }

  return <TaskDetailClient launchId={launchId} itemId={itemId} />;
}
