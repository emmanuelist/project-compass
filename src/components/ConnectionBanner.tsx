import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

export function ConnectionBanner() {
  const { isError } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error();
      return true;
    },
    retry: false,
    refetchInterval: 15000,
  });

  if (!isError) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-destructive/20 text-destructive px-4 py-2 text-sm animate-slide-down">
      <AlertTriangle className="h-4 w-4" />
      Backend API unreachable. Ensure your server is running on localhost:8000.
    </div>
  );
}
