import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { fetchLabels, exportLabelsUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const { data: labels } = useQuery({
    queryKey: ["labels"],
    queryFn: fetchLabels,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export BIP-329 Labels</DialogTitle>
          <DialogDescription>Download all labels as a BIP-329 .jsonl file.</DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Total labels: <span className="text-foreground font-medium">{labels?.length ?? "…"}</span>
        </p>

        <Button asChild className="w-full">
          <a href={exportLabelsUrl()} download="labels.jsonl">
            <Download className="h-4 w-4 mr-2" />
            Download Labels
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
