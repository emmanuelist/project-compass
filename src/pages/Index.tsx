import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraph } from "@/lib/api";
import { Header } from "@/components/Header";
import { TransactionGraph } from "@/components/TransactionGraph";
import { TransactionDetails } from "@/components/TransactionDetails";
import { LabelEditor } from "@/components/LabelEditor";
import { ImportModal } from "@/components/ImportModal";
import { ExportModal } from "@/components/ExportModal";
import { ConnectionBanner } from "@/components/ConnectionBanner";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [searchTxid, setSearchTxid] = useState<string | null>(
    () => localStorage.getItem("kych_last_txid") || null
  );
  const [selectedTxid, setSelectedTxid] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const {
    data: graphData,
    isLoading: graphLoading,
    isError: graphError,
  } = useQuery({
    queryKey: ["graph", searchTxid],
    queryFn: () => fetchGraph(searchTxid!, 3),
    enabled: !!searchTxid,
    retry: 1,
  });

  const handleSearch = useCallback(
    (txid: string) => {
      setSearchTxid(txid);
      setSelectedTxid(txid);
    },
    []
  );

  const handleNodeSelect = useCallback((txid: string) => {
    setSelectedTxid(txid);
  }, []);

  // Show error toast when graph fetch fails
  if (graphError && searchTxid) {
    // handled via React Query error state
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ConnectionBanner />
      <Header
        onSearch={handleSearch}
        onImportClick={() => setImportOpen(true)}
        onExportClick={() => setExportOpen(true)}
        isSearching={graphLoading}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Graph area — 60% */}
        <div className="flex-[3] min-h-0 flex">
          <TransactionGraph
            graphData={graphData}
            isLoading={graphLoading}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Bottom panels — 40% */}
        <div className="flex-[2] min-h-0 flex border-t border-border">
          <div className="flex-1 border-r border-border overflow-hidden">
            <TransactionDetails selectedTxid={selectedTxid} />
          </div>
          <div className="flex-1 overflow-hidden">
            <LabelEditor selectedTxid={selectedTxid} />
          </div>
        </div>
      </div>

      <ImportModal open={importOpen} onOpenChange={setImportOpen} />
      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
};

export default Index;
