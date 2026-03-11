

# Address Clustering + Minimap Overlay

## Feature 1: Address Clustering

Group transactions that share common addresses into visual clusters. The mock data has addresses like `alice`, `bob`, `exchange` that connect multiple transactions -- these become collapsible cluster groups.

### Approach
- **New file: `src/lib/graph-clustering.ts`** -- Pure function that takes a `CytoscapeGraph` and `DEMO_TRANSACTIONS` data, analyzes which nodes share addresses (via inputs/outputs), and produces Cytoscape compound node elements. Each address that appears in 2+ transactions creates a parent cluster node. Child transaction nodes get a `parent` field pointing to their cluster.
- **Modified: `src/components/TransactionGraph.tsx`**
  - Add a `clusteringEnabled` state toggle (button in the zoom controls area)
  - When enabled, run the clustering function and add compound parent nodes to the elements array
  - Add Cytoscape stylesheet entries for compound nodes: rounded rectangle shape, semi-transparent fill, dashed border, address label at top
  - Double-click on a cluster node toggles collapse/expand by hiding/showing children and resizing the parent to a single node
  - Add cluster-specific styles: `$node > node` selector for compound parents with distinct visual treatment
- **Modified: `src/types/index.ts`** -- Add optional `parent` and `is_cluster` fields to `CytoscapeNodeData`
- **Modified: `src/components/GraphLegend.tsx`** -- Add "Cluster" entry to legend when clustering is active
- **Modified: `src/lib/mock-data.ts`** -- Add `address` field to node data in `DEMO_GRAPH` so clustering can work without needing separate transaction lookup (derive from `DEMO_TRANSACTIONS`)

### Clustering Logic
For the demo data, addresses like `bob` (appears in txA output, txB input/output, txE input/output) would create a "bob" cluster containing txA, txB, txE. An address must appear in 2+ distinct transactions to form a cluster. Each node belongs to the cluster of its most-connected address (to avoid overlapping parents, since Cytoscape compound nodes don't support multiple parents).

### Visual Design
- Cluster parent nodes: rounded rectangle, `background-opacity: 0.08`, dashed border in a muted purple/teal color, address label truncated at top
- A toggle button (network/grid icon) in the zoom controls to enable/disable clustering
- Collapsed clusters show as a single larger node with a count badge; expanding re-reveals children with layout animation

## Feature 2: Minimap Overlay

A small inset panel in the top-right corner showing the entire graph zoomed-out, with a blue rectangle indicating the current viewport bounds.

### Approach
- **New file: `src/components/GraphMinimap.tsx`** -- A React component that:
  - Receives the Cytoscape `Core` ref
  - Renders a `<canvas>` element (160x100px, glass background)
  - On mount and on every `viewport`/`position`/`layoutstop` event from Cytoscape, redraws:
    1. All nodes as small colored dots (2-3px) using the same color scheme (blue/green/gray)
    2. All edges as thin gray lines
    3. A semi-transparent blue rectangle showing the current viewport extent mapped to minimap coordinates
  - Click/drag on the minimap pans the main graph to that position
  - Uses `requestAnimationFrame` for throttled redraws
- **Modified: `src/components/TransactionGraph.tsx`** -- Import and render `<GraphMinimap>` in the graph view, positioned `absolute top-3 right-3` (shift zoom controls or legend as needed to avoid overlap). Pass `cyRef.current` as a prop. Only render when graph has data.

### Minimap Rendering
- Map graph bounding box to minimap canvas coordinates
- Draw nodes as circles with color based on `is_coinbase`/`has_label`/selected state
- Draw edges as lines between node positions
- Draw viewport rectangle: map `cy.extent()` to minimap coords, stroke with blue border + translucent fill
- On `mousedown` + `mousemove` on canvas, compute the graph-space position and call `cy.pan()` to center on it

### Layout Adjustments
- Move the `GraphLegend` from `top-3 left-3` to stay where it is
- Place minimap at `top-3 right-3`
- Zoom controls remain at `bottom-3 right-3` (no conflict)

## Technical Details

**New files (2):**
- `src/lib/graph-clustering.ts` -- clustering algorithm
- `src/components/GraphMinimap.tsx` -- canvas-based minimap

**Modified files (4):**
- `src/components/TransactionGraph.tsx` -- clustering toggle, minimap integration, compound node styles
- `src/types/index.ts` -- add `parent`/`is_cluster`/`cluster_label`/`child_count` to node data
- `src/components/GraphLegend.tsx` -- cluster legend entry
- `src/lib/mock-data.ts` -- add address data to graph nodes

**No new dependencies.** Canvas API for minimap, Cytoscape's built-in compound node support for clustering.

