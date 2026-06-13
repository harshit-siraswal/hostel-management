import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "amber" | "teal";

const tones: Record<Tone, string> = {
  success: "text-[color:var(--success)] border-[color:var(--success)]/40 bg-[color:var(--success)]/10",
  warning: "text-[color:var(--warning)] border-[color:var(--warning)]/40 bg-[color:var(--warning)]/10",
  danger:  "text-[color:var(--danger)] border-[color:var(--danger)]/40 bg-[color:var(--danger)]/10",
  info:    "text-[color:var(--info)] border-[color:var(--info)]/40 bg-[color:var(--info)]/10",
  amber:   "text-[color:var(--amber)] border-[color:var(--amber)]/40 bg-[color:var(--amber)]/10",
  teal:    "text-[color:var(--teal)] border-[color:var(--teal)]/40 bg-[color:var(--teal)]/10",
  neutral: "text-muted-foreground border-border bg-card/60",
};

export function StatusChip({ label, tone = "neutral", className }: { label: string; tone?: Tone; className?: string }) {
  return (
    <span className={cn("chip tabular", tones[tone], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (["paid", "approved", "resolved", "matched", "active", "success"].includes(s)) return "success";
  if (["due", "pending", "assigned", "in_progress", "manual_review", "low_confidence", "warning", "partial"].includes(s)) return "warning";
  if (["overdue", "rejected", "failed", "closed", "expired", "danger", "full"].includes(s)) return "danger";
  if (["open", "info", "available"].includes(s)) return "info";
  return "neutral";
}

export function prettyStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
