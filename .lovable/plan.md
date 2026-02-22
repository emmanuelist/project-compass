

# Know Your Coin History (KYCH) — Implementation Plan

## Overview
A Bitcoin transaction explorer frontend that connects to your local backend API (`localhost:8000`). Users can visualize transaction ancestry graphs, annotate transactions with BIP-329 labels, and import/export label files.

---

## Phase 1: Foundation & Theming
- **Dark theme setup** — Apply the Bitcoin-inspired color palette (dark slate background `#0F172A`, surface `#1E293B`, Bitcoin orange `#F7931A` primary, blue secondary)
- **Typography** — Add Inter and JetBrains Mono (for txids) fonts
- **API client layer** — Create a configurable API service pointing to `localhost:8000` with all endpoints (transactions, graph, labels CRUD, import/export)
- **TypeScript types** — Define `Transaction`, `BIP329Label`, `CytoscapeGraph`, `CytoscapeNode`, `CytoscapeEdge` interfaces

## Phase 2: Main Layout & Header
- **App layout** — Full-height layout with header bar, graph canvas (60% viewport), and bottom detail panels
- **Header bar** — KYCH logo, search input (validates 64-char hex txid), search button, Import and Export buttons
- **Responsive shell** — Panels stack vertically on tablet, collapse into bottom sheets on mobile

## Phase 3: Transaction Graph (Core Feature)
- **Install `react-cytoscapejs` and `cytoscape-dagre`** for directed acyclic graph layout
- **Graph canvas** — Renders transaction ancestry nodes and fund-flow edges with arrows
- **Node coloring** — Blue (regular), Green (labeled), Orange (selected), Gray (coinbase)
- **Interactions** — Click node to select, pan/zoom, zoom +/- buttons, reset view button
- **React Query integration** — Fetch graph data from `/api/graph/cytoscape/{txid}?depth=3` with caching

## Phase 4: Transaction Details Panel
- **Bottom-left panel** — Shows selected transaction's txid (truncated + copy button), confirmations, total BTC value (8 decimals), human-readable timestamp, input/output counts
- **Collapsible input/output lists** showing addresses and values
- **External link** to view full transaction on mempool.space
- **Loading skeletons** while fetching transaction details

## Phase 5: Label Editor Panel
- **Bottom-right panel** — Label type dropdown (tx, addr, input, output), reference field (auto-filled from selection), label text input, Save button
- **Existing labels list** with edit and delete actions (with confirmation dialog)
- **Optimistic updates** — Immediately reflect label changes in the UI and graph node colors
- **React Query mutations** for POST/PUT/DELETE label operations with toast notifications

## Phase 6: Import & Export Modals
- **Import modal** — File upload dropzone accepting `.jsonl` files, preview of first 5 parsed labels, Import button calling `POST /api/labels/import/bip329`
- **Export modal** — Shows total label count, Download button triggering file download from `GET /api/labels/export/bip329`

## Phase 7: Error Handling & Polish
- **Inline validation** for invalid txid format
- **Toast notifications** for not-found transactions, successful label saves, import/export results
- **Connection banner** when the backend API is unreachable
- **localStorage persistence** of last searched txid
- **Smooth transitions** and loading states throughout

---

## Key Technical Decisions
- **No backend** — Pure frontend connecting to your existing `localhost:8000` API via a configurable base URL
- **React Query** for all API data fetching, caching, and mutations
- **Cytoscape.js** with dagre layout for the graph visualization
- **Existing UI components** (shadcn/ui) for buttons, inputs, dialogs, toasts, selects, etc.

