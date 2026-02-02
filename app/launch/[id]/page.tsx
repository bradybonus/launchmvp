"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLaunch } from "@/lib/context/LaunchContext";
import { countPlanProgress } from "@/lib/launch-plan";
import { AppHeader } from "@/components/shared/AppHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { LaunchPlanView } from "@/components/launch-plan/LaunchPlanView";
import { LaunchPlanHeader } from "@/components/launch-plan/LaunchPlanHeader";

export default function LaunchPlanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getLaunchById, updateItemStatus, markLaunchReady } = useLaunch();
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

  const progress = countPlanProgress(launch.plan);
  const allComplete = progress.total > 0 && progress.done === progress.total;
  const canMarkReady = allComplete && launch.status === "in_progress";

  const breadcrumb = [
    { label: "Dashboard", href: "/" },
    { label: launch.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-3">
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
          onItemStatusChange={(groupId, itemId, status) =>
            updateItemStatus(launch.id, groupId, itemId, status)
          }
        />
        </div>
      </main>
    </div>
  );
}
