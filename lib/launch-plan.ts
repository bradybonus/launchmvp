import type { Launch, LaunchPlan, TaskGroup, TaskGroupContentItem } from "./types";

export function countPlanProgress(plan: LaunchPlan): { done: number; total: number; pct: number } {
  let total = 0;
  let done = 0;
  for (const section of plan.sections ?? []) {
    for (const group of section.taskGroups ?? []) {
      for (const item of group.items ?? []) {
        total++;
        if (item.status === "done") done++;
      }
    }
  }
  return {
    done,
    total,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function findContentItem(
  launch: Launch | null | undefined,
  itemId: string
): { group: TaskGroup; item: TaskGroupContentItem } | undefined {
  if (!launch?.plan) return undefined;
  const sections = launch.plan.sections;
  if (!Array.isArray(sections)) return undefined;
  try {
    for (const section of sections) {
      const groups = section?.taskGroups;
      if (!Array.isArray(groups)) continue;
      for (const group of groups) {
        if (!group || typeof group !== "object") continue;
        const items = group.items;
        if (!Array.isArray(items)) continue;
        const item = items.find((i) => i && i.id === itemId && i.type === "content");
        if (item && item.type === "content") return { group: group as TaskGroup, item };
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}
