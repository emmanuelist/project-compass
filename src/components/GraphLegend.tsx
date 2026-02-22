export function GraphLegend() {
  const items = [
    { color: "bg-accent", label: "Regular" },
    { color: "bg-[hsl(142,71%,45%)]", label: "Labeled" },
    { color: "bg-muted-foreground", label: "Coinbase" },
    { color: "bg-primary", label: "Selected" },
  ];

  return (
    <div className="absolute top-3 left-3 glass rounded-lg px-3 py-2 space-y-1.5 z-10">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Legend</span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          <span className="text-[11px] text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
