"use client";

import type { Launch, Task, TaskStatus, PlanSection } from "@/lib/types";

interface LaunchPlanViewProps {
  launch: Launch;
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void;
}

function getStatusLabel(status: Task["status"]): string {
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

function TaskRow({
  task,
  onStatusChange,
}: {
  task: Task;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}) {
  const isDone = task.status === "done";
  const nextStatus: TaskStatus = isDone ? "not_started" : "done";

  return (
    <div className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 transition-colors">
      <div className="flex shrink-0 items-center pt-0.5">
        <button
          type="button"
          onClick={() => onStatusChange?.(task.id, nextStatus)}
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
        <p className={`font-medium text-gray-900 ${isDone ? "line-through text-gray-500" : ""}`}>
          {task.title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">{task.owner}</span>
          {task.connectedSystem !== "None" && (
            <span
              className={`rounded border px-2 py-0.5 text-xs font-medium ${getConnectedSystemBadgeClass(task.connectedSystem)}`}
            >
              {task.connectedSystem}
            </span>
          )}
          <span className="text-xs text-gray-400">{getStatusLabel(task.status)}</span>
        </div>
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  onTaskStatusChange,
}: {
  section: PlanSection;
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void;
}) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">{section.title}</h3>
      <div className="space-y-2">
        {section.tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onStatusChange={onTaskStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

export function LaunchPlanView({ launch, onTaskStatusChange }: LaunchPlanViewProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-6">
      {launch.plan.sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          onTaskStatusChange={onTaskStatusChange}
        />
      ))}
    </div>
  );
}
