# Launch — Product Launch Prototype

A high-fidelity clickable prototype for **Launch**, an AI-powered system of record that helps companies turn shipped product features into successful customer launches. The initial wedge feature is **Auto-Launcher**.

This is a conceptual prototype for founder storytelling, investor conversations, and design partner feedback. It is not a full application: no real integrations, analytics, or permissions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context API + localStorage persistence

## Getting Started

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm run start
```

## Prototype Flows

1. **Dashboard** (`/`) — Recent launches, stats, and a "New Launch" CTA.
2. **New Launch** (`/new-launch`) — Form: feature name, size, target audience, target date. Generates a launch plan and redirects to the plan view.
3. **Launch Plan** (`/launch/[id]`) — Sections (Messaging, Enablement, Customer Comms, Internal Readiness), tasks with owner and connected system, progress bar. "Mark Ready" enables when all tasks are complete.
4. **Generated Assets** (`/launch/[id]/assets`) — AI-generated release notes, sales email, and in-app copy. Editable; "Push to Salesforce" etc. are disabled (Coming soon).
5. **Ready to Launch** (`/launch/[id]/ready`) — Final checklist and "Confirm Launch". Success state then return to dashboard.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), import the repository.
3. Use default settings (Next.js detected). Deploy.
4. Share the deployed URL for demos.

No environment variables are required for the prototype.

## Project Structure

- `app/` — Routes and pages (dashboard, new-launch, launch/[id], assets, ready).
- `components/` — Dashboard, launch-form, launch-plan, and assets UI.
- `lib/` — Types, mock data, and LaunchContext (state + localStorage).

## Out of Scope (by design)

- Real API integrations (Salesforce, Zendesk, Pendo).
- User authentication and permissions.
- Real analytics or admin workflows.
- Actual AI calls (content is mock/template-based).
