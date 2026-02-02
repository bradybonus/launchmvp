"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Launch, CreateLaunchInput, TaskStatus } from "../types";
import { createLaunchFromInput, MOCK_LAUNCHES } from "../mock-data";

const STORAGE_KEY = "launch-wedge-launches";

interface LaunchContextValue {
  launches: Launch[];
  createLaunch: (data: CreateLaunchInput) => Launch;
  getLaunchById: (id: string) => Launch | undefined;
  updateTaskStatus: (launchId: string, taskId: string, status: TaskStatus) => void;
  updateAsset: (launchId: string, assetId: string, content: string) => void;
  markLaunchReady: (launchId: string) => void;
  confirmLaunch: (launchId: string) => void;
}

const LaunchContext = createContext<LaunchContextValue | null>(null);

function loadLaunches(): Launch[] {
  if (typeof window === "undefined") return MOCK_LAUNCHES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Launch[];
      return parsed.length > 0 ? parsed : MOCK_LAUNCHES;
    }
  } catch {
    // ignore
  }
  return MOCK_LAUNCHES;
}

function saveLaunches(launches: Launch[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(launches));
  } catch {
    // ignore
  }
}

export function LaunchProvider({ children }: { children: React.ReactNode }) {
  const [launches, setLaunches] = useState<Launch[]>(MOCK_LAUNCHES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLaunches(loadLaunches());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLaunches(launches);
  }, [launches, hydrated]);

  const createLaunch = useCallback((data: CreateLaunchInput): Launch => {
    const launch = createLaunchFromInput(data);
    setLaunches((prev) => [launch, ...prev]);
    return launch;
  }, []);

  const getLaunchById = useCallback(
    (id: string): Launch | undefined => {
      return launches.find((l) => l.id === id);
    },
    [launches]
  );

  const updateTaskStatus = useCallback(
    (launchId: string, taskId: string, status: TaskStatus) => {
      setLaunches((prev) =>
        prev.map((launch) => {
          if (launch.id !== launchId) return launch;
          return {
            ...launch,
            plan: {
              ...launch.plan,
              sections: launch.plan.sections.map((section) => ({
                ...section,
                tasks: section.tasks.map((task) =>
                  task.id === taskId ? { ...task, status } : task
                ),
              })),
            },
          };
        })
      );
    },
    []
  );

  const updateAsset = useCallback(
    (launchId: string, assetId: string, content: string) => {
      setLaunches((prev) =>
        prev.map((launch) => {
          if (launch.id !== launchId) return launch;
          return {
            ...launch,
            assets: launch.assets.map((asset) =>
              asset.id === assetId ? { ...asset, content } : asset
            ),
          };
        })
      );
    },
    []
  );

  const markLaunchReady = useCallback((launchId: string) => {
    setLaunches((prev) =>
      prev.map((l) => (l.id === launchId ? { ...l, status: "ready" as const } : l))
    );
  }, []);

  const confirmLaunch = useCallback((launchId: string) => {
    setLaunches((prev) =>
      prev.map((l) => (l.id === launchId ? { ...l, status: "live" as const } : l))
    );
  }, []);

  const value: LaunchContextValue = {
    launches,
    createLaunch,
    getLaunchById,
    updateTaskStatus,
    updateAsset,
    markLaunchReady,
    confirmLaunch,
  };

  return <LaunchContext.Provider value={value}>{children}</LaunchContext.Provider>;
}

export function useLaunch() {
  const ctx = useContext(LaunchContext);
  if (!ctx) throw new Error("useLaunch must be used within LaunchProvider");
  return ctx;
}
