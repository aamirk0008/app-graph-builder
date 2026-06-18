# App Graph Builder

A responsive service dependency graph visualization tool built as a take-home assessment. Visualize, inspect, and manage service graphs with a clean dark UI.

![App Graph Builder](https://img.shields.io/badge/version-0.6.0-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![ReactFlow](https://img.shields.io/badge/ReactFlow-12-purple)

---

## Live Demo

[https://app-graph-builder.vercel.app](https://app-graph-builder.vercel.app)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework + build tool |
| TypeScript (strict) | Type safety across entire codebase |
| ReactFlow (xyflow) v12 | Canvas rendering, node interactions |
| TanStack Query v5 | Server state, caching, loading/error states |
| Zustand v5 | UI state (selected app/node, drawer, tabs) |
| MSW v2 | Mock Service Worker API interception |
| Tailwind CSS v4 | Styling |
| shadcn/ui (manual) | UI primitives (Tabs, Badge, Input, Slider) |
| Radix UI | Accessible component primitives |

---

## Features

### Layout
- Top bar with brand, selected app pill, Fit View and Add Node buttons
- Icon-style left rail navigation
- Right panel with apps list + node inspector
- Responsive — right panel becomes a slide-over drawer on mobile

### ReactFlow Canvas
- Custom `ServiceNode` cards matching the reference screenshot
- Drag nodes freely across the canvas
- Click to select a node — highlights with purple ring
- Delete selected node with `Delete` or `Backspace`
- Zoom and pan (default ReactFlow behavior)
- Fit view on initial load and via Fit button

### Node Inspector
- Opens in right panel when a node is selected
- **Status pill** — Healthy / Degraded / Down with semantic colors
- **Config tab** — edit service name, status, description
- **Runtime tab** — resource usage slider + numeric input (synced both ways)
- All edits persist directly into ReactFlow node data
- Changes reflect live on the canvas node card

### TanStack Query
- `GET /api/apps` — loads app list with 400ms simulated latency
- `GET /api/apps/:appId/graph` — loads nodes + edges per app
- Skeleton loading states while fetching
- Error states with retry button
- Results cached — switching back to an app uses cached data
- Graph automatically refetches when selected app changes

### Zustand Store
- `selectedAppId` — drives graph query and top bar display
- `selectedNodeId` — drives inspector panel visibility
- `isMobilePanelOpen` — controls mobile drawer
- `activeInspectorTab` — persists active tab between node selections
- `addNode` — action injected by canvas, called from top bar

### Keyboard Shortcuts
| Key | Action |
|---|---|
| `F` | Fit view |
| `P` | Toggle mobile panel |
| `Escape` | Deselect node / close drawer |
| `Delete` / `Backspace` | Delete selected node |

### Bonus Features
- **Add Node button** — creates a new service node at canvas center, auto-selects it, immediately editable in inspector
- **Service vs Database node types** — different icons and colors (purple for service, blue for database)
- **Inspector edits persist to node data** — name, status, resource value all write back to ReactFlow node data cleanly

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx          # Brand, fit view, add node, mobile toggle
│   │   ├── LeftRail.tsx        # Icon navigation
│   │   └── RightPanel.tsx      # Apps list + inspector container
│   ├── canvas/
│   │   ├── FlowCanvas.tsx      # ReactFlow setup, node/edge state
│   │   └── ServiceNode.tsx     # Custom node card component
│   ├── inspector/
│   │   └── NodeInspector.tsx   # Tabs, slider, editable fields
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
├── hooks/
│   ├── useApps.ts              # GET /api/apps
│   └── useGraph.ts             # GET /api/apps/:id/graph
├── mocks/
│   ├── handlers.ts             # MSW request handlers
│   └── browser.ts              # MSW worker setup
├── store/
│   └── appStore.ts             # Zustand store
├── types/
│   └── index.ts                # Shared TypeScript types
├── lib/
│   └── utils.ts                # cn() utility
├── App.tsx                     # Layout composition + keyboard shortcuts
├── main.tsx                    # Entry point, QueryClient, MSW bootstrap
└── index.css                   # Tailwind v4 + theme tokens
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 8+

### Install

```bash
git clone https://github.com/aamirk0008/app-graph-builder
cd app-graph-builder/client-side
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `tsc -b && vite build` | Type check + production build |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint across all files |
| `typecheck` | `tsc --noEmit` | TypeScript strict type check |
| `format` | `prettier --write` | Format all source files |

---

## Versioned Build History

| Tag | What shipped |
|---|---|
| `v0.1` | Scaffold — configs, types, store, mocks, hooks, ui primitives |
| `v0.2` | Layout shell — TopBar, LeftRail, RightPanel, responsive drawer |
| `v0.3` | TanStack Query — apps list, loading/error states, app selection |
| `v0.4` | ReactFlow canvas — ServiceNode, drag, select, delete, fitView |
| `v0.5` | Node Inspector — tabs, status pill, synced slider, edits persist |
| `v0.6` | Keyboard shortcuts, Add Node button, polish, deployment |

```bash
# Jump to any version
git checkout v0.3
npm install
npm run dev
```

---

## Mock API

All API calls are intercepted by MSW — no backend required.

| Endpoint | Response | Latency |
|---|---|---|
| `GET /api/apps` | List of 5 apps | 400ms |
| `GET /api/apps/:appId/graph` | Nodes + edges for app | 600ms |

Mock data lives in `src/mocks/handlers.ts`. Each app returns a different graph with varying node statuses and resource values.

---

## Architecture Decisions

**Why Zustand over Context?**
Zustand avoids prop drilling without the boilerplate of Context + useReducer. The store is minimal — only UI state lives here, never server data.

**Why MSW over setTimeout mocks?**
MSW intercepts at the network level so requests appear in the browser's Network tab, making the mock indistinguishable from a real API during review.

**Why `data as ServiceNodeData` instead of `NodeProps<ServiceNodeData>`?**
`@xyflow/react` v12 changed the `NodeProps` generic to expect a full Node object. Casting `props.data` is the correct pattern for this version.

**Why Tailwind v4?**
No `tailwind.config.js` needed — all theme tokens live in `index.css` under `@theme {}`. The `@tailwindcss/vite` plugin handles everything.

---

## Evaluation Criteria Coverage

| Criteria | Implementation |
|---|---|
| Layout structure + responsiveness | TopBar, LeftRail, RightPanel, mobile drawer |
| ReactFlow integration | Custom nodes, drag, select, delete, zoom/pan, fitView |
| TanStack Query | Loading/error/cached states, refetch on app change |
| Zustand state | Minimal store, no over-stored derived data |
| TypeScript strict | `strict: true`, no implicit any, consistent type imports |
| Code readability | Components split by concern, no prop drilling |
| Bonus — Add Node | ✅ Top bar button, canvas center placement |
| Bonus — Node types | ✅ Service (purple) vs Database (blue) |
| Bonus — Persist edits | ✅ Name, status, resource value write to node data |
| Bonus — Keyboard shortcuts | ✅ F, P, Escape, Delete/Backspace |
