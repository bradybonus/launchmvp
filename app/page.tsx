"use client";

import { useLaunch } from "@/lib/context/LaunchContext";
import { Header } from "@/components/dashboard/Header";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { LaunchCardGrid } from "@/components/dashboard/LaunchCardGrid";

export default function DashboardPage() {
  const { launches } = useLaunch();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Recent launches and readiness at a glance.
          </p>
        </div>
        <div className="mb-8">
          <StatsSummary launches={launches} />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent launches
          </h2>
          <LaunchCardGrid launches={launches} />
        </div>
      </main>
    </div>
  );
}
