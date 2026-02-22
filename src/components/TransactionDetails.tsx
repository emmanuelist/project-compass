import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, ExternalLink, ChevronDown, ChevronRight, FileText, Check } from "lucide-react";
import { fetchTransaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/hooks/use-demo-mode";

interface TransactionDetailsProps {
  selectedTxid: string | null;
}

export function TransactionDetails({ selectedTxid }: TransactionDetailsProps) {
  const { toast } = useToast();
  const { isDemoMode, getDemoTransaction } = useDemoMode();
  const [inputsOpen, setInputsOpen] = useState(true);
  const [outputsOpen, setOutputsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const { data: apiTx, isLoading } = useQuery({
    queryKey: ["transaction", selectedTxid],
    queryFn: () => fetchTransaction(selectedTxid!),
    enabled: !!selectedTxid && !isDemoMode,
  });

  const tx = isDemoMode ? (selectedTxid ? getDemoTransaction(selectedTxid) : undefined) : apiTx;

  const copyTxid = () => {
    if (selectedTxid) {
      navigator.clipboard.writeText(selectedTxid);
      setCopied(true);
      toast({ title: "Copied", description: "Transaction ID copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    toast({ title: "Copied", description: "Address copied." });
  };

  const truncate = (s: string) => `${s.slice(0, 8)}…${s.slice(-8)}`;

  if (!selectedTxid) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">Select a node to view details.</p>
      </div>
    );
  }

  if (!isDemoMode && isLoading) {
    return (
      <div className="p-4 space-y-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded shimmer-bg" />
          <Skeleton className="h-5 w-32 shimmer-bg" />
        </div>
        <Skeleton className="h-8 w-full shimmer-bg rounded-md" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-4 w-24 shimmer-bg" />
          <Skeleton className="h-4 w-16 shimmer-bg" />
          <Skeleton className="h-4 w-20 shimmer-bg" />
          <Skeleton className="h-4 w-28 shimmer-bg" />
        </div>
        <Skeleton className="h-20 w-full shimmer-bg rounded-md" />
      </div>
    );
  }

  if (!tx) return null;

  const confirmationBadge = tx.confirmations >= 6
    ? <Badge variant="outline" className="border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] text-[10px] px-1.5 py-0 h-5">Confirmed</Badge>
    : tx.confirmations > 0
    ? <Badge variant="outline" className="border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] text-[10px] px-1.5 py-0 h-5">Recent ({tx.confirmations})</Badge>
    : <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-[10px] px-1.5 py-0 h-5">Unconfirmed</Badge>;

  return (
    <div key={selectedTxid} className="p-4 space-y-4 overflow-y-auto text-sm animate-fade-in h-full">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground text-sm">Transaction Details</h3>
      </div>

      {/* TXID */}
      <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2 border border-border">
        <code className="font-mono text-xs text-foreground flex-1 truncate">{truncate(tx.txid)}</code>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={copyTxid}>
          {copied ? <Check className="h-3 w-3 text-[hsl(var(--success))]" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <span className="text-muted-foreground text-xs">Status</span>
        <div>{confirmationBadge}</div>

        <span className="text-muted-foreground text-xs">Confirmations</span>
        <span className="text-foreground text-xs font-mono">{tx.confirmations.toLocaleString()}</span>

        <span className="text-muted-foreground text-xs">Value</span>
        <span className="font-mono text-xs text-foreground">
          {tx.total_value.toFixed(8)} <span className="text-primary">BTC</span>
        </span>

        <span className="text-muted-foreground text-xs">Time</span>
        <span className="text-foreground text-xs">{new Date(tx.timestamp * 1000).toLocaleString()}</span>
      </div>

      {/* Inputs */}
      <Collapsible open={inputsOpen} onOpenChange={setInputsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium">
          {inputsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          Inputs ({tx.inputs.length})
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="rounded-md border border-border overflow-hidden">
            {tx.inputs.map((inp, i) => (
              <div key={i} className={`flex items-center justify-between px-3 py-1.5 text-xs ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                <button
                  onClick={() => inp.address && copyAddress(inp.address)}
                  className="font-mono text-muted-foreground hover:text-foreground transition-colors truncate text-left"
                >
                  {inp.address ? truncate(inp.address) : "coinbase"}
                </button>
                {inp.value !== undefined && (
                  <span className="font-mono text-foreground shrink-0 ml-3">
                    {inp.value.toFixed(8)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Outputs */}
      <Collapsible open={outputsOpen} onOpenChange={setOutputsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium">
          {outputsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          Outputs ({tx.outputs.length})
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="rounded-md border border-border overflow-hidden">
            {tx.outputs.map((out, i) => (
              <div key={out.n} className={`flex items-center justify-between px-3 py-1.5 text-xs ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                <button
                  onClick={() => out.address && copyAddress(out.address)}
                  className="font-mono text-muted-foreground hover:text-foreground transition-colors truncate text-left"
                >
                  {out.address ? truncate(out.address) : "OP_RETURN"}
                </button>
                <span className="font-mono text-foreground shrink-0 ml-3">
                  {out.value.toFixed(8)}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* View on Mempool */}
      <Button variant="outline" size="sm" className="w-full text-xs" asChild>
        <a href={`https://mempool.space/tx/${tx.txid}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          View on Mempool
        </a>
      </Button>
    </div>
  );
}
