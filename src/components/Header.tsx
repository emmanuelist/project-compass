import { useState } from "react";
import { Search, Upload, Download, Bitcoin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onSearch: (txid: string) => void;
  onImportClick: () => void;
  onExportClick: () => void;
  isSearching?: boolean;
}

const TXID_REGEX = /^[a-fA-F0-9]{64}$/;

export function Header({ onSearch, onImportClick, onExportClick, isSearching }: HeaderProps) {
  const [txidInput, setTxidInput] = useState(() =>
    localStorage.getItem("kych_last_txid") || ""
  );
  const { toast } = useToast();

  const handleSearch = () => {
    const trimmed = txidInput.trim();
    if (!TXID_REGEX.test(trimmed)) {
      toast({
        title: "Invalid Transaction ID",
        description: "Please enter a valid 64-character hex transaction ID.",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("kych_last_txid", trimmed);
    onSearch(trimmed);
  };

  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-2 shrink-0">
        <Bitcoin className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight text-foreground hidden sm:inline">
          KYCH
        </span>
      </div>

      <div className="flex flex-1 items-center gap-2 max-w-2xl">
        <Input
          className={`font-mono text-sm transition-shadow duration-300 ${isSearching ? "ring-2 ring-primary/40" : ""}`}
          placeholder="Enter transaction ID (64-char hex)"
          value={txidInput}
          onChange={(e) => setTxidInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          maxLength={64}
        />
        <Button onClick={handleSearch} disabled={isSearching} size="sm">
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="hidden sm:inline">{isSearching ? "Searching" : "Search"}</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onImportClick}>
          <Upload className="h-4 w-4" />
          <span className="hidden md:inline">Import</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onExportClick}>
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export</span>
        </Button>
      </div>
    </header>
  );
}
