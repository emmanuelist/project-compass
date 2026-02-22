import { ChevronRight } from "lucide-react";

interface GraphBreadcrumbProps {
  trail: string[];
  onSelect: (txid: string) => void;
}

export function GraphBreadcrumb({ trail, onSelect }: GraphBreadcrumbProps) {
  if (trail.length === 0) return null;

  const truncate = (s: string) => `${s.slice(0, 6)}…${s.slice(-6)}`;

  return (
    <div className="flex items-center gap-1 px-4 py-1.5 bg-card/50 border-b border-border overflow-x-auto no-scrollbar">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium shrink-0 mr-1">Trail</span>
      {trail.map((txid, i) => (
        <div key={txid} className="flex items-center gap-1 shrink-0">
          {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
          <button
            onClick={() => onSelect(txid)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors ${
              i === trail.length - 1
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
            }`}
          >
            {truncate(txid)}
          </button>
        </div>
      ))}
    </div>
  );
}
