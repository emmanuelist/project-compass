import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CytoscapeGraph } from "@/types";

interface StatusBarProps {
  selectedTxid: string | null;
  graphData: CytoscapeGraph | undefined;
  isDemoMode: boolean;
}

export function StatusBar({ selectedTxid, graphData, isDemoMode }: StatusBarProps) {
  const { toast } = useToast();

  const { isError: isDisconnected } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error();
      return true;
    },
    retry: false,
    refetchInterval: 15000,
    enabled: !isDemoMode,
  });

  const truncate = (s: string) => `${s.slice(0, 10)}…${s.slice(-10)}`;

  const copyTxid = () => {
    if (selectedTxid) {
      navigator.clipboard.writeText(selectedTxid);
      toast({ title: "Copied", description: "TXID copied to clipboard." });
    }
  };

  const nodeCount = graphData?.nodes.length ?? 0;
  const edgeCount = graphData?.edges.length ?? 0;

  return (
    <footer className="h-7 flex items-center justify-between px-3 border-t border-border bg-card/50 text-[11px] font-mono text-muted-foreground shrink-0 select-none">
      <div className="flex items-center gap-3">
        {!isDemoMode && (
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isDisconnected ? "bg-destructive" : "bg-[hsl(var(--success))]"}`} />
            <span>{isDisconnected ? "Disconnected" : "Connected"}</span>
          </div>
        )}
        {isDemoMode && (
          <span className="text-primary font-semibold">DEMO</span>
        )}
        {graphData && (
          <span>{nodeCount} nodes · {edgeCount} edges</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {selectedTxid && (
          <button
            onClick={copyTxid}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <span>{truncate(selectedTxid)}</span>
            <Copy className="h-2.5 w-2.5" />
          </button>
        )}
      </div>
    </footer>
  );
}
