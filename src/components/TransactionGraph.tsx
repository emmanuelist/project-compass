import { useRef, useCallback, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CytoscapeGraph } from "@/types";

dagre(cytoscape);

const STYLESHEET: cytoscape.StylesheetCSS[] = [
  {
    selector: "node",
    style: {
      label: "data(label)",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "10px",
      "font-family": "'JetBrains Mono', monospace",
      color: "#94a3b8",
      "background-color": "#3b82f6",
      width: 28,
      height: 28,
      "border-width": 2,
      "border-color": "#1e293b",
    },
  },
  {
    selector: "node[?has_label]",
    style: { "background-color": "#22c55e" },
  },
  {
    selector: "node[?is_coinbase]",
    style: { "background-color": "#64748b" },
  },
  {
    selector: "node:selected",
    style: {
      "background-color": "#f7931a",
      "border-color": "#f7931a",
      "border-width": 3,
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#334155",
      "target-arrow-color": "#334155",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      label: "data(label)",
      "font-size": "8px",
      "font-family": "'JetBrains Mono', monospace",
      color: "#64748b",
      "text-rotation": "autorotate",
      "text-margin-y": -10,
    },
  },
];

const LAYOUT = {
  name: "dagre",
  rankDir: "LR",
  spacingFactor: 1.4,
  nodeDimensionsIncludeLabels: true,
};

interface TransactionGraphProps {
  graphData: CytoscapeGraph | undefined;
  isLoading: boolean;
  onNodeSelect: (txid: string) => void;
}

export function TransactionGraph({ graphData, isLoading, onNodeSelect }: TransactionGraphProps) {
  const cyRef = useRef<cytoscape.Core | null>(null);

  const handleCyInit = useCallback(
    (cy: cytoscape.Core) => {
      cyRef.current = cy;
      cy.on("tap", "node", (e) => {
        const txid = e.target.data("txid");
        if (txid) onNodeSelect(txid);
      });
    },
    [onNodeSelect]
  );

  useEffect(() => {
    // Re-run layout when data changes
    if (cyRef.current && graphData) {
      cyRef.current.layout(LAYOUT as any).run();
      cyRef.current.fit(undefined, 40);
    }
  }, [graphData]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Skeleton className="w-3/4 h-3/4 rounded-lg" />
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">
          Search for a transaction ID to visualize its ancestry graph.
        </p>
      </div>
    );
  }

  const elements = [
    ...graphData.nodes.map((n) => ({ data: n.data, group: "nodes" as const })),
    ...graphData.edges.map((e) => ({ data: e.data, group: "edges" as const })),
  ];

  return (
    <div className="flex-1 relative bg-background">
      <CytoscapeComponent
        elements={elements}
        stylesheet={STYLESHEET}
        layout={LAYOUT as any}
        cy={handleCyInit}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.3)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={() => cyRef.current?.zoom(cyRef.current.zoom() / 1.3)}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={() => cyRef.current?.fit(undefined, 40)}
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
