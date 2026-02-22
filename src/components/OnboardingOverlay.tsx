import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function OnboardingOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("kych_onboarded")) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("kych_onboarded", "true");
    setShow(false);
  };

  if (!show) return null;

  const steps = [
    { num: 1, title: "Search any Bitcoin transaction", desc: "Paste a 64-character TXID to explore its ancestry graph", position: "top-16 left-1/2 -translate-x-1/2" },
    { num: 2, title: "Or explore with sample data", desc: "Toggle Demo Mode to instantly see the tool in action", position: "top-16 right-8" },
    { num: 3, title: "Visualize transaction ancestry", desc: "Click nodes to inspect details, drag to pan, scroll to zoom", position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm animate-fade-in flex items-center justify-center">
      <div className="relative max-w-md w-full mx-4 space-y-6">
        <h2 className="text-xl font-bold text-foreground text-center">Welcome to KYCH</h2>
        <p className="text-sm text-muted-foreground text-center">Bitcoin transaction ancestry explorer</p>

        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-3 p-3 rounded-lg border border-border bg-card/80 animate-scale-in" style={{ animationDelay: `${step.num * 150}ms` }}>
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                {step.num}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={dismiss} className="w-full">
          Got it, let's explore
        </Button>
      </div>
    </div>
  );
}
