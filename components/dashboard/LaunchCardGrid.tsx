import type { Launch } from "@/lib/types";
import { LaunchCard } from "./LaunchCard";

interface LaunchCardGridProps {
  launches: Launch[];
}

export function LaunchCardGrid({ launches }: LaunchCardGridProps) {
  if (launches.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">No launches yet.</p>
        <p className="mt-1 text-sm text-gray-400">
          Create your first launch to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {launches.map((launch) => (
        <LaunchCard key={launch.id} launch={launch} />
      ))}
    </div>
  );
}
