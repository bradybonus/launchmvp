export type FeatureSize = "minor" | "medium" | "major";

export type LaunchStatus = "draft" | "in_progress" | "ready" | "live";

export type TaskStatus = "not_started" | "in_progress" | "done";

export type ConnectedSystem = "Salesforce" | "Zendesk" | "Pendo" | "Help Center" | "Slack" | "None";

export type PlanSectionKey = "messaging" | "enablement" | "customer_comms" | "internal_readiness";

/** Single action item (no editable content). */
export interface TaskGroupActionItem {
  type: "task";
  id: string;
  title: string;
  status: TaskStatus;
}

/** Editable content piece (e.g. Positioning, Value Prop, Key message). */
export interface TaskGroupContentItem {
  type: "content";
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
}

export type TaskGroupItem = TaskGroupActionItem | TaskGroupContentItem;

/** A launch-plan row: container for 1-to-many items (tasks or content). */
export interface TaskGroup {
  id: string;
  title: string;
  owner: string;
  connectedSystem: ConnectedSystem;
  items: TaskGroupItem[];
}

export interface PlanSection {
  id: PlanSectionKey;
  title: string;
  taskGroups: TaskGroup[];
}

export interface LaunchPlan {
  scopeSummary: string;
  sections: PlanSection[];
}

export type AssetType = "release_notes" | "sales_email" | "in_app_copy";

export interface Asset {
  id: string;
  type: AssetType;
  title: string;
  content: string;
  status: "draft" | "published";
}

export interface Launch {
  id: string;
  name: string;
  featureSize: FeatureSize;
  targetAudience: string;
  targetDate: string;
  status: LaunchStatus;
  createdDate: string;
  plan: LaunchPlan;
  assets: Asset[];
}

export interface CreateLaunchInput {
  name: string;
  featureSize: FeatureSize;
  targetAudience: string;
  targetDate: string;
}
