import type { Launch } from "@/lib/types";

interface StatsSummaryProps {
  launches: Launch[];
}

export function StatsSummary({ launches }: StatsSummaryProps) {
  const activeCount = launches.filter(
    (l) => l.status === "in_progress" || l.status === "ready"
  ).length;
  const upcomingDates = launches
    .filter((l) => l.status !== "live" && l.targetDate)
    .map((l) => l.targetDate)
    .sort();
  const nextDate = upcomingDates[0] ?? "—";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Active launches</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{activeCount}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Next target date</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{nextDate}</p>
      </div>
    </div>
  );
}
