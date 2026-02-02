import Link from "next/link";
import type { Launch, FeatureSize } from "@/lib/types";

interface LaunchCardProps {
  launch: Launch;
}

function getSizeBadgeClass(size: FeatureSize): string {
  switch (size) {
    case "minor":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-orange-100 text-orange-800";
    case "major":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusBadgeClass(status: Launch["status"]): string {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-700";
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    case "ready":
      return "bg-green-100 text-green-700";
    case "live":
      return "bg-green-100 text-green-800 font-medium";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getProgress(launch: Launch): number {
  let total = 0;
  let done = 0;
  for (const section of launch.plan.sections) {
    for (const task of section.tasks) {
      total++;
      if (task.status === "done") done++;
    }
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function LaunchCard({ launch }: LaunchCardProps) {
  const progress = getProgress(launch);
  const sizeClass = getSizeBadgeClass(launch.featureSize);
  const statusClass = getStatusBadgeClass(launch.status);

  return (
    <Link
      href={`/launch/${launch.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{launch.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
        >
          {launch.status === "in_progress"
            ? "In progress"
            : launch.status === "ready"
              ? "Ready"
              : launch.status === "live"
                ? "Live"
                : "Draft"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sizeClass}`}
        >
          {launch.featureSize.charAt(0).toUpperCase() + launch.featureSize.slice(1)}
        </span>
        <span className="text-sm text-gray-500">Target: {launch.targetDate}</span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
