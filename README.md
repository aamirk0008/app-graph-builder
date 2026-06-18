# Aiynx — App Graph Builder

A responsive, ReactFlow-powered dashboard for visualizing and editing service dependency graphs. Select an application, explore its services and databases on an interactive canvas, and inspect or edit any node's configuration and runtime state through a synced detail panel.

**Live demo:** [app-graph-builder-rust.vercel.app](https://app-graph-builder-rust.vercel.app/)
**Repository:** [github.com/aamirk0008/app-graph-builder](https://github.com/aamirk0008/app-graph-builder)

<!--
  TODO: drop in 1–2 screenshots or a short GIF here, e.g.:
  ![App Graph Builder — canvas and inspector](./docs/screenshot-main.png)
  Capture the canvas with a node selected and the Inspector's Runtime tab open,
  since that single view demonstrates the graph, the status pill, and the synced slider at once.
-->

---

## Overview

App Graph Builder was built as a take-home assessment focused on layout composition, ReactFlow fundamentals, server-state and UI-state separation, and clean TypeScript architecture. Rather than iterating ad hoc, the project follows a versioned build plan — each version (`v0.1` through `v0.6`) is an independently runnable, tagged checkpoint that builds on the last, making the project easy to review, debug, or roll back at any stage.

## Features

- **Top bar, left rail, and right panel layout** matching the assessment's reference screenshot, with a dotted ReactFlow canvas as the centerpiece
- **Responsive design** — the right panel collapses into a slide-over drawer on small screens, toggled via Zustand state
- **Interactive canvas** with draggable, selectable nodes; delete via keyboard; zoom, pan, and fit-view; distinct visual treatment for service vs. database node types
- **Node Inspector** with Config and Runtime tabs, a live status pill, editable name and description fields, and a custom slider that stays numerically synced with a paired input — all edits persist directly to the node's data
- **Mock API layer** via MSW, simulating `GET /apps` and `GET /apps/:appId/graph` with realistic latency, loading states, and error handling
- **Keyboard shortcuts** — `F` to fit the view, `Escape` to deselect, `P` to toggle the mobile panel
- **Add Node** button to create new service nodes directly on the canvas
- Strict TypeScript throughout, with clean `lint` and `typecheck` runs as a release gate

## Requirements Checklist

Mapped against the assessment's functional requirements:

- [x] Layout: top bar, left rail, right panel, dotted canvas
- [x] Responsive: right panel becomes a mobile drawer
- [x] ReactFlow: 3+ nodes, drag, select, delete, zoom/pan, fit view
- [x] Node inspector: tabs, status pill, synced slider + numeric input, persisted edits
- [x] TanStack Query: mock `/apps` and `/apps/:appId/graph`, with loading/error states
- [x] Zustand: selected app/node, mobile panel open, active inspector tab
- [x] TypeScript strict mode, ESLint, and required scripts (`dev`, `build`, `preview`, `lint`, `typecheck`)

## Tech Stack

| Concern | Choice |
|---|---|
| UI framework | React + Vite |
| Canvas | ReactFlow (`@xyflow/react`) |
| Server state | TanStack Query |
| UI state | Zustand |
| API mocking | MSW (Mock Service Worker) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui primitives |
| Language | TypeScript (strict mode) |
| Deployment | Vercel |

## Architecture Notes

A few decisions worth calling out, since they shaped how the codebase is structured:

**Server state vs. UI state are kept strictly separate.** TanStack Query owns anything that comes from (mocked) the network — the list of apps and each app's graph — including its own loading, error, and caching behavior. Zustand owns transient UI state only: `selectedAppId`, `selectedNodeId`, `isMobilePanelOpen`, and `activeInspectorTab`. Derived values are computed via selectors rather than duplicated into the store.

**Node data flows through ReactFlow's own state, not a separate source of truth.** Edits made in the Inspector (name, status, description, resource slider) are written back into the selected node's `data` via ReactFlow's `setNodes`, and read back out using ReactFlow's reactive `useNodes()` hook rather than the imperative `getNode()` accessor — the latter returns a non-reactive snapshot and won't trigger a re-render when node data changes elsewhere, which causes inspector fields to silently desync from the canvas.

**Typing around ReactFlow's generics.** `ServiceNodeData` extends `Record<string, unknown>` and `NodeProps` is used in its generic form (`NodeProps<ServiceNodeData>`) so the node component satisfies ReactFlow's type system without resorting to unsafe casts.

## Versioned Build Log

| Version | Scope |
|---|---|
| `v0.1` | Scaffold — configs, types, store, mocks, hooks, UI primitives |
| `v0.2` | Layout shell — TopBar, LeftRail, RightPanel, responsive drawer |
| `v0.3` | TanStack Query wired to MSW data, loading/error states, app selection |
| `v0.4` | ReactFlow canvas — ServiceNode, drag, select, delete, fit view |
| `v0.5` | Node Inspector — tabs, status pill, synced slider, edits persisting to node data |
| `v0.6` | Polish — keyboard shortcuts, Add Node, distinct node-type styling, clean lint/typecheck |

Each tag is a working, deployable state of the app.

## Project Structure

```
src/
├─ App.tsx, main.tsx, index.css
├─ assets/                  static images
├─ components/
│  ├─ canvas/                FlowCanvas, ServiceNode — the ReactFlow surface
│  ├─ inspector/              NodeInspector — tabs, status pill, slider, fields
│  ├─ layout/                 TopBar, LeftRail, RightPanel
│  └─ ui/                     shadcn-style primitives (badge, button, input,
│                              skeleton, slider, tabs, textarea)
├─ hooks/                    useApps, useGraph — TanStack Query data hooks
├─ lib/                      shared utilities
├─ mocks/                    MSW handlers and browser worker setup
├─ store/                    appStore — Zustand UI state
└─ types/                    shared TypeScript types
```

Layout, canvas, inspector, and data-fetching concerns each live in their own folder, with no cross-cutting components — `hooks/` is the only place that talks to the mock API, and `store/` is the only place that holds cross-component UI state.

## Mock API

MSW intercepts two endpoints, both returning JSON with a simulated delay:

```ts
GET /api/apps
// → [{ id: "app-1", name: "supertokens-golang" }, ...]

GET /api/apps/:appId/graph
// → {
//     nodes: [{ id, type: "service" | "database", data: { label, status, resourceValue, cost, provider, description } }, ...],
//     edges: [{ id, source, target }, ...]
//   }
```

Handlers live in `src/mocks/handlers.ts`; the worker is registered in `src/mocks/browser.ts`. No real network calls are made — switching apps in the left panel triggers a new `GET /api/apps/:appId/graph` request through TanStack Query, which handles caching, loading, and error states.

## Getting Started

The app lives inside the `client-side/` subfolder of this repository.

```bash
git clone https://github.com/aamirk0008/app-graph-builder.git
cd app-graph-builder/client-side
npm install
```

### Available scripts

```bash
npm run dev        # start the local dev server
npm run build       # type-check and build for production
npm run preview      # preview the production build locally
npm run lint         # run ESLint
npm run typecheck    # run the TypeScript compiler with no emit
npm run format       # format source files with Prettier
```

Once running, open the printed local URL (typically `http://localhost:5173`) in your browser.

### Windows / PowerShell notes

If you need to force a clean dependency install, delete `node_modules` and the lockfile with PowerShell equivalents rather than Unix commands, then reinstall — never hand-edit `package-lock.json`:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Deployment

The project deploys to Vercel from the `client-side/` subfolder. If forking or redeploying, set the project's **Root Directory** explicitly to `client-side` in the Vercel project settings — Vercel won't infer this automatically for a nested frontend.

## Known Constraints

- `eslint` is pinned to exactly `8.57.0` (no caret) via an `overrides` block, since ESLint v10 breaks compatibility with the plugin set used here.
- The TypeScript target is 5.5, so compiler options specific to newer TypeScript releases (e.g. `erasableSyntaxOnly`, `tsBuildInfoFile`) are intentionally omitted.
- All mock data is in-memory and resets on reload — there is no persistent backend.
