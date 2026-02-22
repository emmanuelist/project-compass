import { useRef, useCallback, useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { GraphLegend } from "@/components/GraphLegend";
import type { CytoscapeGraph } from "@/types";

dagre(cytoscape);

const STYLESHEET: cytoscape.StylesheetStyle[] = [
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
      "overlay-padding": "6px",
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
    selector: "node:active",
    style: {
      "overlay-opacity": 0.1,
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
  onDemoActivate?: () => void;
}

export function TransactionGraph({ graphData, isLoading, onNodeSelect, onDemoActivate }: TransactionGraphProps) {
  const cyRef = useRef<cytoscape.Core | null>(null);

  const handleCyInit = useCallback(
    (cy: cytoscape.Core) => {
      cyRef.current = cy;
      cy.on("tap", "node", (e) => {
        const txid = e.target.data("txid");
        if (txid) onNodeSelect(txid);
      });
      // Pointer cursor on nodes
      cy.on("mouseover", "node", () => {
        document.body.style.cursor = "pointer";
      });
      cy.on("mouseout", "node", () => {
        document.body.style.cursor = "";
      });
    },
    [onNodeSelect]
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (cyRef.current && graphData) {
      cyRef.current.layout(LAYOUT as any).run();
      cyRef.current.fit(undefined, 40);
    }
  }, [graphData]);

  useEffect(() => {
    if (graphData && !isLoading) {
      requestAnimationFrame(() => setIsReady(true));
    } else {
      setIsReady(false);
    }
  }, [graphData, isLoading]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background dot-grid-bg animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-glow" />
            <Bitcoin className="h-10 w-10 text-primary animate-spin-slow" />
          </div>
          <p className="text-muted-foreground text-sm animate-fade-in">Loading graph…</p>
        </div>
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background dot-grid-bg">
        <div className="flex flex-col items-center gap-6 max-w-sm text-center animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 w-32 h-32 rounded-full border border-dashed border-border -m-4" />
            <div className="absolute inset-0 w-24 h-24 rounded-full border border-dashed border-border/60 m-0" />
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center border border-border">
              <Bitcoin className="h-8 w-8 text-primary/60" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-semibold text-foreground">No Transaction Loaded</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Search for a transaction ID to visualize its ancestry graph, or try demo mode with sample data.
            </p>
          </div>
          {onDemoActivate && (
            <Button variant="outline" size="sm" onClick={onDemoActivate} className="text-xs">
              <Bitcoin className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Try Demo Mode
            </Button>
          )}
        </div>
      </div>
    );
  }

  const elements = [
    ...graphData.nodes.map((n) => ({ data: n.data, group: "nodes" as const })),
    ...graphData.edges.map((e) => ({ data: e.data, group: "edges" as const })),
  ];

  const nodeCount = graphData.nodes.length;
  const edgeCount = graphData.edges.length;

  return (
    <TooltipProvider delayDuration={200}>
      <div className={`flex-1 relative bg-background dot-grid-bg transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}>
        <CytoscapeComponent
          elements={elements}
          stylesheet={STYLESHEET}
          layout={LAYOUT as any}
          cy={handleCyInit}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />

        <GraphLegend />

        {/* Node/Edge count */}
        <div className="absolute bottom-3 left-3 glass rounded-md px-2.5 py-1 text-[11px] font-mono text-muted-foreground z-10">
          {nodeCount} nodes · {edgeCount} edges
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 glass"
                onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.3)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom In</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 glass"
                onClick={() => cyRef.current?.zoom(cyRef.current.zoom() / 1.3)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom Out</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 glass"
                onClick={() => cyRef.current?.fit(undefined, 40)}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Fit to View</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 glass"
                onClick={() => {
                  cyRef.current?.layout(LAYOUT as any).run();
                  cyRef.current?.fit(undefined, 40);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Reset Layout</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
