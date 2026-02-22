import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText } from "lucide-react";
import { importLabels } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { BIP329Label } from "@/types";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportModal({ open, onOpenChange }: ImportModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<BIP329Label[]>([]);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter(Boolean).slice(0, 5);
      try {
        setPreview(lines.map((l) => JSON.parse(l)));
      } catch {
        setPreview([]);
      }
    };
    reader.readAsText(f);
  }, []);

  const mutation = useMutation({
    mutationFn: () => importLabels(file!),
    onSuccess: (data) => {
      toast({ title: "Import successful", description: `${data.count ?? "Labels"} imported.` });
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      queryClient.invalidateQueries({ queryKey: ["graph"] });
      onOpenChange(false);
      setFile(null);
      setPreview([]);
    },
    onError: (e: Error) => toast({ title: "Import failed", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import BIP-329 Labels</DialogTitle>
          <DialogDescription>Upload a .jsonl file with BIP-329 formatted labels.</DialogDescription>
        </DialogHeader>

        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".jsonl";
            input.onchange = () => input.files?.[0] && handleFile(input.files[0]);
            input.click();
          }}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {file ? file.name : "Drop .jsonl file here or click to browse"}
          </p>
        </div>

        {preview.length > 0 && (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            <span className="text-xs text-muted-foreground">Preview (first 5):</span>
            {preview.map((l, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono">
                <FileText className="h-3 w-3 text-accent shrink-0" />
                <span className="text-accent">[{l.type}]</span>
                <span className="truncate text-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        )}

        <Button disabled={!file || mutation.isPending} onClick={() => mutation.mutate()} className="w-full">
          {mutation.isPending ? "Importing…" : "Import Labels"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
