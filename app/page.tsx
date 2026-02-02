"use client";

import Link from "next/link";
import { useLaunch } from "@/lib/context/LaunchContext";
import { AppHeader } from "@/components/shared/AppHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { LaunchCardGrid } from "@/components/dashboard/LaunchCardGrid";

export default function DashboardPage() {
  const { launches } = useLaunch();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        rightAction={
          <Link
            href="/new-launch"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Launch
          </Link>
        }
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Breadcrumb items={[{ label: "Dashboard" }]} />
        <div className="mb-8 mt-3">
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
