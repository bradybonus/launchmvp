"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Launch, CreateLaunchInput, PlanSection, TaskStatus } from "../types";
import { createLaunchFromInput, MOCK_LAUNCHES } from "../mock-data";

const STORAGE_KEY = "launch-wedge-launches";

interface LaunchContextValue {
  launches: Launch[];
  createLaunch: (data: CreateLaunchInput) => Launch;
  getLaunchById: (id: string) => Launch | undefined;
  /** Update status of an item inside a task group. */
  updateItemStatus: (launchId: string, groupId: string, itemId: string, status: TaskStatus) => void;
  /** Update content of a content item inside a task group. */
  updateItemContent: (launchId: string, groupId: string, itemId: string, content: string) => void;
  updateAsset: (launchId: string, assetId: string, content: string) => void;
  markLaunchReady: (launchId: string) => void;
  confirmLaunch: (launchId: string) => void;
}

const LaunchContext = createContext<LaunchContextValue | null>(null);

/** Migrate old plan shape (section.tasks) to new shape (section.taskGroups). */
function migrateLaunch(launch: Launch): Launch {
  const sections = launch.plan?.sections as { id: string; title: string; tasks?: unknown[]; taskGroups?: unknown[] }[] | undefined;
  if (!Array.isArray(sections)) return launch;
  const hasOldShape = sections.some((s) => Array.isArray(s.tasks));
  if (!hasOldShape) return launch;
  return {
    ...launch,
    plan: {
      ...launch.plan,
      sections: sections.map((section) => {
          const sec = section as {
            id: string;
            title: string;
            tasks?: {
              id: string;
              title: string;
              owner: string;
              status: string;
              connectedSystem: string;
              content?: string;
            }[];
          };
          const tasks = sec.tasks;
          if (!Array.isArray(tasks))
            return { id: sec.id, title: sec.title, taskGroups: [] };
          const taskGroups = tasks.map((t) => ({
            id: t.id,
            title: t.title,
            owner: t.owner,
            connectedSystem: (t.connectedSystem ?? "None") as import("../types").ConnectedSystem,
            items: [
              {
                type: "content" as const,
                id: `${t.id}-1`,
                title: t.title,
                content: t.content ?? "",
                status: (t.status as "not_started" | "in_progress" | "done") ?? "not_started",
              },
            ],
          }));
          return { id: sec.id, title: sec.title, taskGroups } as PlanSection;
        }) as PlanSection[],
    },
  };
}

function loadLaunches(): Launch[] {
  if (typeof window === "undefined") return MOCK_LAUNCHES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Launch[];
      if (parsed.length > 0) return parsed.map(migrateLaunch);
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

  const updateItemStatus = useCallback(
    (launchId: string, groupId: string, itemId: string, status: TaskStatus) => {
      setLaunches((prev) =>
        prev.map((launch) => {
          if (launch.id !== launchId) return launch;
          const sections = launch.plan?.sections;
          if (!Array.isArray(sections)) return launch;
          return {
            ...launch,
            plan: {
              ...launch.plan,
              sections: sections.map((section) => ({
                ...section,
                taskGroups: Array.isArray(section.taskGroups)
                  ? section.taskGroups.map((group) => {
                      if (group.id !== groupId) return group;
                      return {
                        ...group,
                        items: group.items.map((item) =>
                          item.id === itemId ? { ...item, status } : item
                        ),
                      };
                    })
                  : [],
              })),
            },
          };
        })
      );
    },
    []
  );

  const updateItemContent = useCallback(
    (launchId: string, groupId: string, itemId: string, content: string) => {
      setLaunches((prev) =>
        prev.map((launch) => {
          if (launch.id !== launchId) return launch;
          const sections = launch.plan?.sections;
          if (!Array.isArray(sections)) return launch;
          return {
            ...launch,
            plan: {
              ...launch.plan,
              sections: sections.map((section) => ({
                ...section,
                taskGroups: Array.isArray(section.taskGroups)
                  ? section.taskGroups.map((group) => {
                      if (group.id !== groupId) return group;
                      return {
                        ...group,
                        items: group.items.map((item) => {
                          if (item.id !== itemId || item.type !== "content") return item;
                          return { ...item, content };
                        }),
                      };
                    })
                  : [],
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
    updateItemStatus,
    updateItemContent,
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
