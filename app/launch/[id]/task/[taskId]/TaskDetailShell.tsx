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

export function TaskDetailShell({
  launchId,
  itemId,
}: {
  launchId: string;
  itemId: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <TaskDetailLoading />;
  }

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
