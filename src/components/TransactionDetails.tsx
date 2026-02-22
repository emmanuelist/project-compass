import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { fetchTransaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface TransactionDetailsProps {
  selectedTxid: string | null;
}

export function TransactionDetails({ selectedTxid }: TransactionDetailsProps) {
  const { toast } = useToast();
  const [inputsOpen, setInputsOpen] = useState(false);
  const [outputsOpen, setOutputsOpen] = useState(false);

  const { data: tx, isLoading } = useQuery({
    queryKey: ["transaction", selectedTxid],
    queryFn: () => fetchTransaction(selectedTxid!),
    enabled: !!selectedTxid,
  });

  const copyTxid = () => {
    if (selectedTxid) {
      navigator.clipboard.writeText(selectedTxid);
      toast({ title: "Copied", description: "Transaction ID copied to clipboard." });
    }
  };

  const truncate = (s: string) => `${s.slice(0, 8)}…${s.slice(-8)}`;

  if (!selectedTxid) {
    return (
      <div className="flex items-center justify-center h-full p-4 animate-fade-in">
        <p className="text-muted-foreground text-sm">Select a node to view details.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-3 animate-fade-in">
        {[48, 32, 40, 36].map((w, i) => (
          <Skeleton key={i} className={`h-4 shimmer-bg animate-shimmer`} style={{ width: `${w * 4}px`, animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );
  }

  if (!tx) return null;

  return (
    <div key={selectedTxid} className="p-4 space-y-3 overflow-y-auto text-sm animate-fade-in">
      <h3 className="font-semibold text-foreground hidden md:block">Transaction Details</h3>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">TXID:</span>
        <code className="font-mono text-xs text-foreground">{truncate(tx.txid)}</code>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyTxid}>
          <Copy className="h-3 w-3" />
        </Button>
        <a
          href={`https://mempool.space/tx/${tx.txid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-muted-foreground">Confirmations:</span>
        <span className="text-foreground">{tx.confirmations.toLocaleString()}</span>
        <span className="text-muted-foreground">Value:</span>
        <span className="font-mono text-foreground">{tx.total_value.toFixed(8)} BTC</span>
        <span className="text-muted-foreground">Time:</span>
        <span className="text-foreground">{new Date(tx.timestamp * 1000).toLocaleString()}</span>
      </div>

      <Collapsible open={inputsOpen} onOpenChange={setInputsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          {inputsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          Inputs ({tx.inputs.length})
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 mt-1 space-y-1">
          {tx.inputs.map((inp, i) => (
            <div key={i} className="font-mono text-xs text-muted-foreground">
              {inp.address ? truncate(inp.address) : "coinbase"}{" "}
              {inp.value !== undefined && <span className="text-foreground">{inp.value.toFixed(8)}</span>}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={outputsOpen} onOpenChange={setOutputsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          {outputsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          Outputs ({tx.outputs.length})
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 mt-1 space-y-1">
          {tx.outputs.map((out) => (
            <div key={out.n} className="font-mono text-xs text-muted-foreground">
              {out.address ? truncate(out.address) : "OP_RETURN"}{" "}
              <span className="text-foreground">{out.value.toFixed(8)}</span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
