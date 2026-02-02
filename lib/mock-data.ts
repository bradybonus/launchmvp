import type { Launch, CreateLaunchInput, FeatureSize, PlanSection, Task, Asset, TaskStatus, ConnectedSystem } from "./types";

const MOCK_OWNERS = ["Jordan Chen", "Sam Rivera", "Alex Kim", "Morgan Taylor", "Casey Walsh"];

function generateTasksForSize(featureSize: FeatureSize): PlanSection[] {
  const taskCounts = {
    minor: { messaging: 2, enablement: 2, customer_comms: 2, internal_readiness: 2 },
    medium: { messaging: 3, enablement: 3, customer_comms: 3, internal_readiness: 3 },
    major: { messaging: 4, enablement: 5, customer_comms: 4, internal_readiness: 5 },
  };
  const counts = taskCounts[featureSize];

  const notStarted: TaskStatus = "not_started";
  const messagingTasks: Task[] = [
    { id: "m1", title: "Define positioning and value prop", owner: MOCK_OWNERS[0], status: notStarted, connectedSystem: "None" as ConnectedSystem },
    { id: "m2", title: "Draft key messages and talking points", owner: MOCK_OWNERS[0], status: notStarted, connectedSystem: "None" as ConnectedSystem },
    { id: "m3", title: "Align messaging with product team", owner: MOCK_OWNERS[0], status: notStarted, connectedSystem: "Slack" as ConnectedSystem },
    { id: "m4", title: "Finalize competitive differentiation", owner: MOCK_OWNERS[0], status: notStarted, connectedSystem: "None" as ConnectedSystem },
  ].slice(0, counts.messaging);

  const enablementTasks: Task[] = [
    { id: "e1", title: "Update sales deck and demo script", owner: MOCK_OWNERS[1], status: notStarted, connectedSystem: "Salesforce" as ConnectedSystem },
    { id: "e2", title: "Schedule sales enablement session", owner: MOCK_OWNERS[1], status: notStarted, connectedSystem: "Slack" as ConnectedSystem },
    { id: "e3", title: "Prepare CS team with FAQ and playbook", owner: MOCK_OWNERS[2], status: notStarted, connectedSystem: "Zendesk" as ConnectedSystem },
    { id: "e4", title: "Update demo environment with new feature", owner: MOCK_OWNERS[1], status: notStarted, connectedSystem: "None" as ConnectedSystem },
    { id: "e5", title: "Record short demo video for async enablement", owner: MOCK_OWNERS[1], status: notStarted, connectedSystem: "None" as ConnectedSystem },
  ].slice(0, counts.enablement);

  const customerCommsTasks: Task[] = [
    { id: "c1", title: "Publish release notes", owner: MOCK_OWNERS[0], status: notStarted, connectedSystem: "Help Center" as ConnectedSystem },
    { id: "c2", title: "Send launch email to target segment", owner: MOCK_OWNERS[0], status: notStarted, connectedSystem: "Salesforce" as ConnectedSystem },
    { id: "c3", title: "Configure in-app announcement", owner: MOCK_OWNERS[2], status: notStarted, connectedSystem: "Pendo" as ConnectedSystem },
    { id: "c4", title: "Update help center and knowledge base", owner: MOCK_OWNERS[2], status: notStarted, connectedSystem: "Zendesk" as ConnectedSystem },
  ].slice(0, counts.customer_comms);

  const internalReadinessTasks: Task[] = [
    { id: "i1", title: "Update Salesforce product catalog", owner: MOCK_OWNERS[1], status: notStarted, connectedSystem: "Salesforce" as ConnectedSystem },
    { id: "i2", title: "Create support macros and canned responses", owner: MOCK_OWNERS[2], status: notStarted, connectedSystem: "Zendesk" as ConnectedSystem },
    { id: "i3", title: "Set up Pendo guides and analytics", owner: MOCK_OWNERS[2], status: notStarted, connectedSystem: "Pendo" as ConnectedSystem },
    { id: "i4", title: "Notify stakeholders in Slack", owner: MOCK_OWNERS[0], status: notStarted, connectedSystem: "Slack" as ConnectedSystem },
    { id: "i5", title: "Confirm go-live checklist with engineering", owner: MOCK_OWNERS[0], status: notStarted, connectedSystem: "Slack" as ConnectedSystem },
  ].slice(0, counts.internal_readiness);

  return [
    { id: "messaging", title: "Messaging", tasks: messagingTasks },
    { id: "enablement", title: "Enablement", tasks: enablementTasks },
    { id: "customer_comms", title: "Customer Comms", tasks: customerCommsTasks },
    { id: "internal_readiness", title: "Internal Readiness", tasks: internalReadinessTasks },
  ];
}

function generateScopeSummary(name: string, featureSize: FeatureSize, targetAudience: string): string {
  const sizeDesc =
    featureSize === "minor"
      ? "incremental update"
      : featureSize === "medium"
        ? "notable feature release"
        : "major product milestone";
  return `${name} is a ${sizeDesc} targeting ${targetAudience}. This launch plan coordinates messaging, enablement, customer communications, and internal readiness so all teams are aligned before go-live.`;
}

function generateReleaseNotes(name: string): string {
  return `## What's new: ${name}

### Overview
This release introduces ${name}, designed to help your team work more effectively.

### Key benefits
- Streamlined workflow for common tasks
- Clear visibility into status and next steps
- Reduced manual coordination across teams

### How to use
1. Navigate to the new section in your dashboard
2. Follow the in-app prompts to get started
3. Reach out to your CSM if you have questions

---
*Generated by Launch AI*`;
}

function generateSalesEmail(name: string, targetAudience: string): string {
  return `Subject: Introducing ${name} — now available for ${targetAudience}

Hi,

We're excited to share that ${name} is now available.

**What you get:**
- Clearer visibility into your workflow
- Less manual back-and-forth
- Alignment across your team

**Next steps:**
We've prepared a short guide in the product. Look for the in-app announcement, or reach out to your customer success manager to schedule a walkthrough.

Best,
Your team`;
}

function generateInAppCopy(name: string): string {
  return `Headline: ${name} is here

Description: We've shipped ${name} to help you [primary benefit]. Get started from your dashboard or check the release notes for details.

CTA: Get started`;
}

function createDefaultAssets(launchName: string, targetAudience: string): Asset[] {
  return [
    {
      id: "asset-release-notes",
      type: "release_notes",
      title: "Release Notes",
      content: generateReleaseNotes(launchName),
      status: "draft",
    },
    {
      id: "asset-sales-email",
      type: "sales_email",
      title: "Sales Email",
      content: generateSalesEmail(launchName, targetAudience),
      status: "draft",
    },
    {
      id: "asset-in-app",
      type: "in_app_copy",
      title: "In-App Copy",
      content: generateInAppCopy(launchName),
      status: "draft",
    },
  ];
}

export function createLaunchFromInput(input: CreateLaunchInput): Launch {
  const id = `launch-${Date.now()}`;
  const createdDate = new Date().toISOString().split("T")[0];
  const sections = generateTasksForSize(input.featureSize);
  const scopeSummary = generateScopeSummary(
    input.name,
    input.featureSize,
    input.targetAudience
  );

  return {
    id,
    name: input.name,
    featureSize: input.featureSize,
    targetAudience: input.targetAudience,
    targetDate: input.targetDate,
    status: "in_progress",
    createdDate,
    plan: { scopeSummary, sections },
    assets: createDefaultAssets(input.name, input.targetAudience),
  };
}

export const MOCK_LAUNCHES: Launch[] = [
  {
    id: "launch-1",
    name: "Smart Notifications",
    featureSize: "medium",
    targetAudience: "All customers",
    targetDate: "2025-02-15",
    status: "in_progress",
    createdDate: "2025-01-28",
    plan: {
      scopeSummary:
        "Smart Notifications is a notable feature release targeting All customers. This launch plan coordinates messaging, enablement, customer communications, and internal readiness so all teams are aligned before go-live.",
      sections: generateTasksForSize("medium"),
    },
    assets: createDefaultAssets("Smart Notifications", "All customers"),
  },
  {
    id: "launch-2",
    name: "Bulk Export",
    featureSize: "minor",
    targetAudience: "Enterprise",
    targetDate: "2025-02-10",
    status: "live",
    createdDate: "2025-01-20",
    plan: {
      scopeSummary:
        "Bulk Export is an incremental update targeting Enterprise. This launch plan coordinates messaging, enablement, customer communications, and internal readiness so all teams are aligned before go-live.",
      sections: generateTasksForSize("minor"),
    },
    assets: createDefaultAssets("Bulk Export", "Enterprise"),
  },
  {
    id: "launch-3",
    name: "Unified Analytics Dashboard",
    featureSize: "major",
    targetAudience: "All customers",
    targetDate: "2025-03-01",
    status: "draft",
    createdDate: "2025-02-01",
    plan: {
      scopeSummary:
        "Unified Analytics Dashboard is a major product milestone targeting All customers. This launch plan coordinates messaging, enablement, customer communications, and internal readiness so all teams are aligned before go-live.",
      sections: generateTasksForSize("major"),
    },
    assets: createDefaultAssets("Unified Analytics Dashboard", "All customers"),
  },
];
