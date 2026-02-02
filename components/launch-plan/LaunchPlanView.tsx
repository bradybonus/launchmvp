"use client";

import Link from "next/link";
import type {
  Launch,
  PlanSection,
  TaskGroup,
  TaskGroupItem,
  TaskStatus,
} from "@/lib/types";

interface LaunchPlanViewProps {
  launch: Launch;
  onItemStatusChange?: (groupId: string, itemId: string, status: TaskStatus) => void;
}

function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "not_started":
      return "Not started";
    case "in_progress":
      return "In progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}

function getConnectedSystemBadgeClass(system: string): string {
  switch (system) {
    case "Salesforce":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Zendesk":
      return "bg-green-50 text-green-700 border-green-200";
    case "Pendo":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Help Center":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Slack":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

function GroupItemRow({
  launchId,
  groupId,
  item,
  groupOwner,
  groupConnectedSystem,
  onStatusChange,
}: {
  launchId: string;
  groupId: string;
  item: TaskGroupItem;
  groupOwner: string;
  groupConnectedSystem: string;
  onStatusChange?: (groupId: string, itemId: string, status: TaskStatus) => void;
}) {
  const isDone = item.status === "done";
  const nextStatus: TaskStatus = isDone ? "not_started" : "done";
  const isContent = item.type === "content";

  return (
    <div className="flex items-start gap-3 rounded-md border border-gray-100 bg-white px-3 py-2.5 hover:border-gray-200 transition-colors">
      <div className="flex shrink-0 items-center pt-0.5">
        <button
          type="button"
          onClick={() => onStatusChange?.(groupId, item.id, nextStatus)}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:border-gray-400"
          aria-label={isDone ? "Mark not started" : "Mark done"}
        >
          {isDone ? (
            <svg className="h-3.5 w-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : null}
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium text-gray-900 ${isDone ? "line-through text-gray-500" : ""}`}>
          {item.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {isContent && (
            <>
              <Link
                href={`/launch/${launchId}/task/${item.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              >
                Preview content
              </Link>
              <span className="text-gray-400">·</span>
            </>
          )}
          <span className="text-xs text-gray-500">{groupOwner}</span>
          {groupConnectedSystem !== "None" && (
            <span
              className={`rounded border px-2 py-0.5 text-xs font-medium ${getConnectedSystemBadgeClass(groupConnectedSystem)}`}
            >
              {groupConnectedSystem}
            </span>
          )}
          <span className="text-xs text-gray-400">{getStatusLabel(item.status)}</span>
        </div>
      </div>
    </div>
  );
}

function TaskGroupBlock({
  launchId,
  group,
  onItemStatusChange,
}: {
  launchId: string;
  group: TaskGroup;
  onItemStatusChange?: (groupId: string, itemId: string, status: TaskStatus) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex items-center gap-2">
        <h4 className="text-base font-semibold text-gray-900">{group.title}</h4>
        <span className="text-sm text-gray-500">{group.owner}</span>
        {group.connectedSystem !== "None" && (
          <span
            className={`rounded border px-2 py-0.5 text-xs font-medium ${getConnectedSystemBadgeClass(group.connectedSystem)}`}
          >
            {group.connectedSystem}
          </span>
        )}
      </div>
      <div className="space-y-1.5 pl-1">
        {group.items.map((item) => (
          <GroupItemRow
            key={item.id}
            launchId={launchId}
            groupId={group.id}
            item={item}
            groupOwner={group.owner}
            groupConnectedSystem={group.connectedSystem}
            onStatusChange={onItemStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

function SectionBlock({
  launchId,
  section,
  onItemStatusChange,
}: {
  launchId: string;
  section: PlanSection;
  onItemStatusChange?: (groupId: string, itemId: string, status: TaskStatus) => void;
}) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{section.title}</h3>
      <div className="space-y-4">
        {section.taskGroups.map((group) => (
          <div
            key={group.id}
            className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
          >
            <TaskGroupBlock
              launchId={launchId}
              group={group}
              onItemStatusChange={onItemStatusChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LaunchPlanView({ launch, onItemStatusChange }: LaunchPlanViewProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-6">
      {launch.plan.sections.map((section) => (
        <SectionBlock
          key={section.id}
          launchId={launch.id}
          section={section}
          onItemStatusChange={onItemStatusChange}
        />
      ))}
    </div>
  );
}
