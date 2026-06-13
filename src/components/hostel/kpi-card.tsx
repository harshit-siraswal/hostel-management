import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";
const accent: Record<Tone, string> = {
  success: "from-[color:var(--success)]/30 to-transparent",
  warning: "from-[color:var(--amber)]/30 to-transparent",
  danger:  "from-[color:var(--danger)]/30 to-transparent",
  info:    "from-[color:var(--teal)]/30 to-transparent",
  neutral: "from-foreground/10 to-transparent",
};

export function KpiCard({
  label, value, hint, tone = "neutral", icon, className,
}: {
  label: string; value: string; hint?: string; tone?: Tone; icon?: ReactNode; className?: string;
}) {
  return (
    <div className={cn("glass-card relative overflow-hidden rounded-xl p-5", className)}>
      <div className={cn("pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl", accent[tone])} />
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </div>
      <div className="mt-3 font-display text-4xl tabular tracking-tight text-foreground">{value}</div>
      {hint ? <div className="mt-2 text-xs text-muted-foreground tabular">{hint}</div> : null}
      <div className="hairline mt-4" />
    </div>
  );
}
