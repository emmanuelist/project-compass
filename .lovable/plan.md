
# Demo Mode Toggle

## Overview
Add a demo mode toggle that populates the UI with hardcoded sample Bitcoin transaction data, allowing users to explore the full interface without a running backend. When demo mode is active, all API calls are bypassed and replaced with mock data.

## User Experience
- A toggle switch in the Header bar labeled "Demo" appears next to the Import/Export buttons
- Clicking it activates demo mode: the graph populates with sample transactions, Transaction Details shows mock data, and the Label Editor works with in-memory labels
- The Connection Banner is hidden in demo mode
- The search bar still works in demo mode (any valid txid will "find" the primary demo transaction)
- Toggling demo mode off clears the demo data and returns to normal API-backed behavior

## Changes

### 1. New file: `src/lib/mock-data.ts`
Hardcoded sample data including:
- **3 transactions** forming a small chain (a coinbase tx funding tx A, which funds tx B)
- **A CytoscapeGraph** with 3 nodes and 2 edges showing the flow
- **2 sample BIP329 labels** attached to the transactions
- All using realistic-looking (but fake) 64-char hex txids and Bitcoin values

### 2. New file: `src/hooks/use-demo-mode.ts`
A small React context/provider to manage demo mode state globally:
- `isDemoMode` boolean state (persisted to localStorage)
- `toggleDemoMode()` function
- `demoGraphData`, `getDemoTransaction(txid)`, `getDemoLabels(ref)` accessors for mock data
- In-memory label CRUD operations (create/update/delete) so the Label Editor works in demo mode

### 3. Modified: `src/pages/Index.tsx`
- Wrap content with `DemoModeProvider`
- When `isDemoMode` is true:
  - Use mock graph data instead of the API query
  - Auto-set the first demo txid as selected on activation
  - Skip the real `useQuery` for graph (set `enabled: false`)
- Pass `isDemoMode` and `toggleDemoMode` to the Header

### 4. Modified: `src/components/Header.tsx`
- Accept `isDemoMode` and `onDemoToggle` props
- Render a `Switch` component with a "Demo" label next to the Import/Export buttons
- When toggled on, show a subtle indicator (the switch turns primary color)

### 5. Modified: `src/components/ConnectionBanner.tsx`
- Accept `isDemoMode` prop (or consume context)
- Return `null` when demo mode is active (no need to warn about backend)

### 6. Modified: `src/components/TransactionDetails.tsx`
- When demo mode is active, use `getDemoTransaction(txid)` from context instead of the API query

### 7. Modified: `src/components/LabelEditor.tsx`
- When demo mode is active, use in-memory label operations from the demo context instead of API mutations

## Technical Details

**Files created:**
- `src/lib/mock-data.ts` -- Hardcoded mock transactions, graph, and labels
- `src/hooks/use-demo-mode.tsx` -- React context provider + hook

**Files modified:**
- `src/pages/Index.tsx` -- Integrate demo mode provider and conditional data sourcing
- `src/components/Header.tsx` -- Add demo toggle switch
- `src/components/ConnectionBanner.tsx` -- Hide when in demo mode
- `src/components/TransactionDetails.tsx` -- Use mock data when in demo mode
- `src/components/LabelEditor.tsx` -- Use in-memory labels when in demo mode

**Mock data structure:**
- 3 txids: one coinbase, two regular transactions forming a chain
- Graph: 3 nodes (coinbase in gray, one labeled in green, one default in blue) with 2 edges showing BTC flow
- Transactions: realistic fields (confirmations, timestamps, inputs/outputs with addresses and values)
- Labels: 2 sample labels ("Mining reward" on the coinbase, "Exchange deposit" on another)

**Demo mode context approach:** Using React Context keeps the demo state accessible to all components without prop drilling, while the provider in Index.tsx keeps it scoped to the main page.
