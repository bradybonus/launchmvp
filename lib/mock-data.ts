import type {
  Launch,
  CreateLaunchInput,
  FeatureSize,
  PlanSection,
  TaskGroup,
  TaskGroupContentItem,
  Asset,
  TaskStatus,
  ConnectedSystem,
} from "./types";

const MOCK_OWNERS = ["Jordan Chen", "Sam Rivera", "Alex Kim", "Morgan Taylor", "Casey Walsh"];
const notStarted: TaskStatus = "not_started";

/** Generate AI-style content for a content item (used in content detail). */
function generateContentForItem(
  groupTitle: string,
  itemTitle: string,
  launchName: string
): string {
  const key = `${groupTitle}::${itemTitle}`;
  const templates: Record<string, string> = {
    "Define positioning and value prop::Positioning": `${launchName} positions as a [differentiator] that helps [target audience] achieve [outcome]. Use this as the anchor for all launch messaging.`,
    "Define positioning and value prop::Value Proposition": `Value prop: [Clear benefit in one sentence]. One-line statement that sales and marketing can use consistently.`,
    "Draft key messages and talking points::Key message 1": `Primary message: ${launchName} delivers [benefit]. Lead with this in all customer-facing comms.`,
    "Draft key messages and talking points::Key message 2": `Supporting message: [Point A]. Use in sales conversations and enablement.`,
    "Draft key messages and talking points::Talking points": `Talking points: (1) [Point A], (2) [Point B], (3) [Point C]. Keep tone confident and operational.`,
    "Finalize competitive differentiation::Differentiators": `How ${launchName} differs from alternatives: [Differentiator 1], [Differentiator 2]. Use only in sales enablement; avoid direct competitor names in customer-facing copy.`,
    "Update sales deck and demo script::Sales deck": `Add ${launchName} to the standard deck: one slide on what it is, one on why it matters, one on how to demo.`,
    "Update sales deck and demo script::Demo script": `Demo script: [Opening] → [Key clicks] → [Close with CTA]. Align with sales deck.`,
    "Prepare CS team with FAQ and playbook::FAQ": `FAQ: What is ${launchName}? Who is it for? How do I enable it? Common questions and answers.`,
    "Prepare CS team with FAQ and playbook::Playbook": `Playbook: steps for common scenarios and when to escalate. Link to FAQ.`,
    "Update demo environment with new feature::Demo setup": `Ensure ${launchName} is enabled and stable in demo org. Add sample data if needed. Document any demo-specific settings.`,
    "Record short demo video for async enablement::Video outline": `3–5 min video: intro to ${launchName}, value, quick demo, and where to find more info. Host in internal knowledge base.`,
    "Publish release notes::Release notes draft": `Draft and publish release notes for ${launchName}: overview, key benefits, how to use, and link to help docs. Use the generated release notes asset as the source.`,
    "Send launch email to target segment::Email copy": `Use the generated sales email asset. Segment: [target audience]. Schedule for [target date]. A/B test subject line if volume allows.`,
    "Configure in-app announcement::Announcement copy": `In-app announcement for ${launchName}: headline, short description, CTA to release notes or help. Use the in-app copy asset. Target by segment if needed.`,
    "Update help center and knowledge base::Help articles": `Add or update help articles for ${launchName}: what it is, how to use it, troubleshooting. Link from release notes and in-app copy.`,
    "Update Salesforce product catalog::Catalog entry": `Add ${launchName} to product catalog in Salesforce. Include description, availability, and link to sales deck or demo.`,
    "Create support macros and canned responses::Macros": `Macros for common ${launchName} questions: how to enable, known limitations, escalation path.`,
    "Create support macros and canned responses::Canned responses": `Canned responses for email and chat. Reference macros where applicable.`,
    "Set up Pendo guides and analytics::Guides": `Create Pendo guides for ${launchName} onboarding if applicable.`,
    "Set up Pendo guides and analytics::Analytics": `Set analytics events for adoption and key actions. Link to guides.`,
    "Notify stakeholders in Slack::Slack post": `Post in #launch or #product: ${launchName} is live. Summary, link to release notes, and who to contact for questions.`,
    "Confirm go-live checklist with engineering::Checklist": `Confirm with engineering: feature flag state, monitoring, rollback plan. Get sign-off before marking launch live.`,
  };
  return (
    templates[key] ??
    `AI-generated content for: ${itemTitle} (${groupTitle}). Context: ${launchName}. Edit as needed, then submit to mark done.`
  );
}

function ensureGroupItemContent(
  sections: PlanSection[],
  launchName: string
): PlanSection[] {
  return sections.map((section) => ({
    ...section,
    taskGroups: section.taskGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        if (item.type !== "content") return item;
        const contentItem = item as TaskGroupContentItem;
        return {
          ...contentItem,
          content:
            contentItem.content?.trim() ||
            generateContentForItem(group.title, item.title, launchName),
        };
      }),
    })),
  }));
}

function generateTaskGroupsForSize(featureSize: FeatureSize): PlanSection[] {
  const groupCounts = {
    minor: { messaging: 2, enablement: 2, customer_comms: 2, internal_readiness: 2 },
    medium: { messaging: 3, enablement: 3, customer_comms: 3, internal_readiness: 3 },
    major: { messaging: 4, enablement: 5, customer_comms: 4, internal_readiness: 5 },
  };
  const counts = groupCounts[featureSize];

  const messagingGroups: TaskGroup[] = [
    {
      id: "m1",
      title: "Define positioning and value prop",
      owner: MOCK_OWNERS[0],
      connectedSystem: "None" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "m1-1", title: "Positioning", content: "", status: notStarted },
        { type: "content" as const, id: "m1-2", title: "Value Proposition", content: "", status: notStarted },
      ],
    },
    {
      id: "m2",
      title: "Draft key messages and talking points",
      owner: MOCK_OWNERS[0],
      connectedSystem: "None" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "m2-1", title: "Key message 1", content: "", status: notStarted },
        { type: "content" as const, id: "m2-2", title: "Key message 2", content: "", status: notStarted },
        { type: "content" as const, id: "m2-3", title: "Talking points", content: "", status: notStarted },
      ],
    },
    {
      id: "m3",
      title: "Align messaging with product team",
      owner: MOCK_OWNERS[0],
      connectedSystem: "Slack" as ConnectedSystem,
      items: [
        { type: "task" as const, id: "m3-1", title: "Share drafts and get alignment", status: notStarted },
      ],
    },
    {
      id: "m4",
      title: "Finalize competitive differentiation",
      owner: MOCK_OWNERS[0],
      connectedSystem: "None" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "m4-1", title: "Differentiators", content: "", status: notStarted },
      ],
    },
  ].slice(0, counts.messaging);

  const enablementGroups: TaskGroup[] = [
    {
      id: "e1",
      title: "Update sales deck and demo script",
      owner: MOCK_OWNERS[1],
      connectedSystem: "Salesforce" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "e1-1", title: "Sales deck", content: "", status: notStarted },
        { type: "content" as const, id: "e1-2", title: "Demo script", content: "", status: notStarted },
      ],
    },
    {
      id: "e2",
      title: "Schedule sales enablement session",
      owner: MOCK_OWNERS[1],
      connectedSystem: "Slack" as ConnectedSystem,
      items: [
        { type: "task" as const, id: "e2-1", title: "Schedule session", status: notStarted },
      ],
    },
    {
      id: "e3",
      title: "Prepare CS team with FAQ and playbook",
      owner: MOCK_OWNERS[2],
      connectedSystem: "Zendesk" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "e3-1", title: "FAQ", content: "", status: notStarted },
        { type: "content" as const, id: "e3-2", title: "Playbook", content: "", status: notStarted },
      ],
    },
    {
      id: "e4",
      title: "Update demo environment with new feature",
      owner: MOCK_OWNERS[1],
      connectedSystem: "None" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "e4-1", title: "Demo setup", content: "", status: notStarted },
      ],
    },
    {
      id: "e5",
      title: "Record short demo video for async enablement",
      owner: MOCK_OWNERS[1],
      connectedSystem: "None" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "e5-1", title: "Video outline", content: "", status: notStarted },
      ],
    },
  ].slice(0, counts.enablement);

  const customerCommsGroups: TaskGroup[] = [
    {
      id: "c1",
      title: "Publish release notes",
      owner: MOCK_OWNERS[0],
      connectedSystem: "Help Center" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "c1-1", title: "Release notes draft", content: "", status: notStarted },
      ],
    },
    {
      id: "c2",
      title: "Send launch email to target segment",
      owner: MOCK_OWNERS[0],
      connectedSystem: "Salesforce" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "c2-1", title: "Email copy", content: "", status: notStarted },
      ],
    },
    {
      id: "c3",
      title: "Configure in-app announcement",
      owner: MOCK_OWNERS[2],
      connectedSystem: "Pendo" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "c3-1", title: "Announcement copy", content: "", status: notStarted },
      ],
    },
    {
      id: "c4",
      title: "Update help center and knowledge base",
      owner: MOCK_OWNERS[2],
      connectedSystem: "Zendesk" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "c4-1", title: "Help articles", content: "", status: notStarted },
      ],
    },
  ].slice(0, counts.customer_comms);

  const internalReadinessGroups: TaskGroup[] = [
    {
      id: "i1",
      title: "Update Salesforce product catalog",
      owner: MOCK_OWNERS[1],
      connectedSystem: "Salesforce" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "i1-1", title: "Catalog entry", content: "", status: notStarted },
      ],
    },
    {
      id: "i2",
      title: "Create support macros and canned responses",
      owner: MOCK_OWNERS[2],
      connectedSystem: "Zendesk" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "i2-1", title: "Macros", content: "", status: notStarted },
        { type: "content" as const, id: "i2-2", title: "Canned responses", content: "", status: notStarted },
      ],
    },
    {
      id: "i3",
      title: "Set up Pendo guides and analytics",
      owner: MOCK_OWNERS[2],
      connectedSystem: "Pendo" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "i3-1", title: "Guides", content: "", status: notStarted },
        { type: "content" as const, id: "i3-2", title: "Analytics", content: "", status: notStarted },
      ],
    },
    {
      id: "i4",
      title: "Notify stakeholders in Slack",
      owner: MOCK_OWNERS[0],
      connectedSystem: "Slack" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "i4-1", title: "Slack post", content: "", status: notStarted },
      ],
    },
    {
      id: "i5",
      title: "Confirm go-live checklist with engineering",
      owner: MOCK_OWNERS[0],
      connectedSystem: "Slack" as ConnectedSystem,
      items: [
        { type: "content" as const, id: "i5-1", title: "Checklist", content: "", status: notStarted },
      ],
    },
  ].slice(0, counts.internal_readiness);

  return [
    { id: "messaging", title: "Messaging", taskGroups: messagingGroups },
    { id: "enablement", title: "Enablement", taskGroups: enablementGroups },
    { id: "customer_comms", title: "Customer Comms", taskGroups: customerCommsGroups },
    { id: "internal_readiness", title: "Internal Readiness", taskGroups: internalReadinessGroups },
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
  const sections = ensureGroupItemContent(
    generateTaskGroupsForSize(input.featureSize),
    input.name
  );
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
      sections: ensureGroupItemContent(
        generateTaskGroupsForSize("medium"),
        "Smart Notifications"
      ),
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
      sections: ensureGroupItemContent(generateTaskGroupsForSize("minor"), "Bulk Export"),
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
      sections: ensureGroupItemContent(
        generateTaskGroupsForSize("major"),
        "Unified Analytics Dashboard"
      ),
    },
    assets: createDefaultAssets("Unified Analytics Dashboard", "All customers"),
  },
];
