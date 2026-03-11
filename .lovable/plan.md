

# Fix: Graph Disappears When Disabling Clustering

## Problem
When toggling clustering off, the graph nodes disappear. The `CytoscapeComponent` from `react-cytoscapejs` doesn't cleanly handle the removal of compound parent nodes and `parent` references from elements. The layout effect fires but the Cytoscape instance still holds stale element state.

## Solution
Add `clusteringEnabled` to the `key` prop of the `CytoscapeComponent`'s parent `div`, forcing a full remount when clustering is toggled. This ensures a clean Cytoscape instance with the correct elements each time.

**File: `src/components/TransactionGraph.tsx`**
- Change `key="graph"` on line 369 to `` key={`graph-${clusteringEnabled}`} ``

This is a one-line fix. The remount is acceptable since the layout animation runs fresh anyway, and it guarantees a clean state transition.

