import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { fetchGraph, ApiError } from "@/lib/api";
import { Header } from "@/components/Header";
import { TransactionGraph } from "@/components/TransactionGraph";
import { TransactionDetails } from "@/components/TransactionDetails";
import { LabelEditor } from "@/components/LabelEditor";
import { ImportModal } from "@/components/ImportModal";
import { ExportModal } from "@/components/ExportModal";
import { ConnectionBanner } from "@/components/ConnectionBanner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { DemoModeProvider, useDemoMode } from "@/hooks/use-demo-mode";

function IndexContent() {
  const { toast } = useToast();
  const { isDemoMode, toggleDemoMode, demoGraphData, defaultDemoTxid } = useDemoMode();
  const [searchTxid, setSearchTxid] = useState<string | null>(
    () => localStorage.getItem("kych_last_txid") || null
  );
  const [selectedTxid, setSelectedTxid] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const isMobile = useIsMobile();

  const {
    data: graphData,
    isLoading: graphLoading,
    error: graphError,
  } = useQuery({
    queryKey: ["graph", searchTxid],
    queryFn: () => fetchGraph(searchTxid!, 3),
    enabled: !!searchTxid && !isDemoMode,
    retry: 1,
  });

  useEffect(() => {
    if (!graphError) return;
    if (graphError instanceof ApiError && graphError.status === 404) {
      toast({
        variant: "destructive",
        title: "Transaction Not Found",
        description: "No transaction exists with that ID. Please check and try again.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transaction. Please try again later.",
      });
    }
  }, [graphError, toast]);

  // Auto-select demo data when demo mode is activated
  useEffect(() => {
    if (isDemoMode) {
      setSearchTxid(defaultDemoTxid);
      setSelectedTxid(defaultDemoTxid);
    }
  }, [isDemoMode, defaultDemoTxid]);

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

  const activeGraphData = isDemoMode ? demoGraphData : graphData;
  const activeLoading = isDemoMode ? false : graphLoading;

  return (
    <div className="flex flex-col h-screen bg-background">
      {!isDemoMode && <ConnectionBanner />}
      <Header
        onSearch={handleSearch}
        onImportClick={() => setImportOpen(true)}
        onExportClick={() => setExportOpen(true)}
        isSearching={activeLoading}
        isDemoMode={isDemoMode}
        onDemoToggle={toggleDemoMode}
      />

      <div className="overflow-y-auto md:overflow-hidden md:flex-1 md:flex md:flex-col md:min-h-0">
        <div className="h-[50vh] md:h-auto md:flex-[3] min-h-[250px] md:min-h-0 flex">
          <TransactionGraph
            graphData={activeGraphData}
            isLoading={activeLoading}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        <div className="flex flex-col md:flex-row md:flex-[2] md:min-h-0 border-t border-border">
          {isMobile ? (
            <>
              <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-foreground border-b border-border hover:bg-muted/50 transition-colors">
                  Transaction Details
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${detailsOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <TransactionDetails selectedTxid={selectedTxid} />
                </CollapsibleContent>
              </Collapsible>
              <Collapsible open={labelsOpen} onOpenChange={setLabelsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-foreground border-b border-border hover:bg-muted/50 transition-colors">
                  Label Editor
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${labelsOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <LabelEditor selectedTxid={selectedTxid} />
                </CollapsibleContent>
              </Collapsible>
            </>
          ) : (
            <>
              <div className="flex-1 md:border-r border-border overflow-hidden md:min-h-0">
                <TransactionDetails selectedTxid={selectedTxid} />
              </div>
              <div className="flex-1 overflow-hidden border-t md:border-t-0 border-border md:min-h-0">
                <LabelEditor selectedTxid={selectedTxid} />
              </div>
            </>
          )}
        </div>
      </div>

      <ImportModal open={importOpen} onOpenChange={setImportOpen} />
      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}

const Index = () => (
  <DemoModeProvider>
    <IndexContent />
  </DemoModeProvider>
);

export default Index;
