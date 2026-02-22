import { useState } from "react";
import { Plus, Upload, Download, Play, Maximize, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionsProps {
  onImport: () => void;
  onExport: () => void;
  onToggleDemo: () => void;
  onFitGraph?: () => void;
  isDemoMode: boolean;
}

export function FloatingActions({ onImport, onExport, onToggleDemo, onFitGraph, isDemoMode }: FloatingActionsProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: Upload, label: "Import", onClick: onImport },
    { icon: Download, label: "Export", onClick: onExport },
    { icon: Play, label: isDemoMode ? "Exit Demo" : "Demo", onClick: onToggleDemo },
    ...(onFitGraph ? [{ icon: Maximize, label: "Fit", onClick: onFitGraph }] : []),
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col-reverse items-center gap-2">
      {open &&
        actions.map((action, i) => (
          <Button
            key={action.label}
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full shadow-lg glass animate-scale-in"
            style={{ animationDelay: `${i * 50}ms` }}
            onClick={() => {
              action.onClick();
              setOpen(false);
            }}
            title={action.label}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-xl"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </Button>
    </div>
  );
}
