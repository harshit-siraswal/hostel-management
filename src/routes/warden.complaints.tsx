import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { complaints } from "@/lib/hostel-data";

export const Route = createFileRoute("/warden/complaints")({
  head: () => ({ meta: [{ title: "Warden · Complaints" }] }),
  component: WardenComplaints,
});

const COLUMNS: Array<{ id: string; label: string }> = [
  { id: "open", label: "Open" },
  { id: "assigned", label: "Assigned" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
];

function WardenComplaints() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = complaints.filter((c) => (filter === "all" ? true : c.priority === filter));

  return (
    <PortalShell role="warden" eyebrow="Maintenance" title="Complaints board">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["all", "urgent", "high", "medium", "low"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              filter === f ? "border-amber bg-amber/15 text-amber" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = filtered.filter((c) => c.status === col.id);
          return (
            <div key={col.id} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{col.label}</div>
                <div className="font-mono text-xs text-muted-foreground tabular">{items.length}</div>
              </div>
              <div className="space-y-3">
                {items.map((c) => (
                  <Card key={c.id} className="!p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-[10px] text-muted-foreground tabular">{c.id}</div>
                      <StatusChip label={c.priority} tone={c.priority === "urgent" || c.priority === "high" ? "danger" : "warning"} />
                    </div>
                    <div className="mt-2 font-medium leading-snug">{c.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.category} · {c.submittedBy}</div>
                    <div className="hairline my-3" />
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{c.assignee || "Unassigned"}</span>
                      <span className="font-mono tabular">{c.updatedAt}</span>
                    </div>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        Pipeline stages:
        {["open", "assigned", "in_progress", "resolved", "closed"].map((s) => (
          <StatusChip key={s} label={prettyStatus(s)} tone={statusTone(s)} />
        ))}
      </div>
    </PortalShell>
  );
}
