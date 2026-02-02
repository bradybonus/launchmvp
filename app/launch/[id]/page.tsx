"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLaunch } from "@/lib/context/LaunchContext";
import { LaunchPlanView } from "@/components/launch-plan/LaunchPlanView";
import { LaunchPlanHeader } from "@/components/launch-plan/LaunchPlanHeader";

export default function LaunchPlanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getLaunchById, updateTaskStatus, markLaunchReady } = useLaunch();
  const launch = getLaunchById(id);

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

  let total = 0;
  let done = 0;
  for (const section of launch.plan.sections) {
    for (const task of section.tasks) {
      total++;
      if (task.status === "done") done++;
    }
  }
  const progress = {
    done,
    total,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
  const allComplete = progress.total > 0 && progress.done === progress.total;
  const canMarkReady = allComplete && launch.status === "in_progress";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Launch
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <LaunchPlanHeader
          launch={launch}
          progress={progress}
          canMarkReady={canMarkReady}
          onMarkReady={() => {
            markLaunchReady(launch.id);
            router.push(`/launch/${launch.id}/ready`);
          }}
        />
        <LaunchPlanView
          launch={launch}
          onTaskStatusChange={(taskId, status) =>
            updateTaskStatus(launch.id, taskId, status)
          }
        />
      </main>
    </div>
  );
}
