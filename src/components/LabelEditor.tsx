import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Save } from "lucide-react";
import { fetchLabelsByRef, createLabel, updateLabel, deleteLabel } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { LabelType, BIP329Label } from "@/types";

interface LabelEditorProps {
  selectedTxid: string | null;
}

export function LabelEditor({ selectedTxid }: LabelEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [labelType, setLabelType] = useState<LabelType>("tx");
  const [ref, setRef] = useState("");
  const [labelText, setLabelText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTxid) {
      setRef(selectedTxid);
      setLabelType("tx");
      setLabelText("");
      setEditingId(null);
    }
  }, [selectedTxid]);

  const { data: labels = [] } = useQuery({
    queryKey: ["labels", ref],
    queryFn: () => fetchLabelsByRef(ref),
    enabled: !!ref,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["labels"] });
    queryClient.invalidateQueries({ queryKey: ["graph"] });
  };

  const saveMutation = useMutation({
    mutationFn: () =>
      editingId
        ? updateLabel(editingId, { type: labelType, ref, label: labelText })
        : createLabel({ type: labelType, ref, label: labelText }),
    onSuccess: () => {
      toast({ title: "Label saved" });
      setLabelText("");
      setEditingId(null);
      invalidate();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLabel,
    onSuccess: () => {
      toast({ title: "Label deleted" });
      invalidate();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEdit = (l: BIP329Label) => {
    setEditingId(l.id || null);
    setLabelType(l.type);
    setRef(l.ref);
    setLabelText(l.label);
  };

  if (!selectedTxid) {
    return (
      <div className="flex items-center justify-center h-full p-4 animate-fade-in">
        <p className="text-muted-foreground text-sm">Select a node to manage labels.</p>
      </div>
    );
  }

  return (
    <div key={selectedTxid} className="p-4 space-y-3 overflow-y-auto text-sm animate-fade-in">
      <h3 className="font-semibold text-foreground hidden md:block">Label Editor</h3>

      <div className="space-y-2">
        <Select value={labelType} onValueChange={(v) => setLabelType(v as LabelType)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tx">tx</SelectItem>
            <SelectItem value="addr">addr</SelectItem>
            <SelectItem value="input">input</SelectItem>
            <SelectItem value="output">output</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className="h-8 font-mono text-xs"
          placeholder="Reference"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
        />

        <Input
          className="h-8 text-xs"
          placeholder="Label text"
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
        />

        <Button
          size="sm"
          className="w-full"
          disabled={!labelText.trim() || saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          <Save className="h-3 w-3 mr-1" />
          {editingId ? "Update" : "Save"} Label
        </Button>
      </div>

      {labels.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-border">
          <span className="text-muted-foreground text-xs">Existing Labels</span>
          {labels.map((l) => (
            <div key={l.id || l.ref} className="flex items-center justify-between gap-2 py-1">
              <div className="min-w-0">
                <span className="text-xs text-accent font-mono">[{l.type}]</span>{" "}
                <span className="text-xs text-foreground truncate">{l.label}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEdit(l)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Label</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this label?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => l.id && deleteMutation.mutate(l.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
