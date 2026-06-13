import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { useComplaints, useUpdateComplaint } from "@/lib/data-layer";

export const Route = createFileRoute("/warden/complaints")({
  head: () => ({ meta: [{ title: "Warden · Complaints" }] }),
  component: WardenComplaints,
});

const COLUMNS: Array<{ id: string; label: string }> = [
  { id: "open", label: "Open" },
  { id: "assigned", label: "Assigned" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
];

function WardenComplaints() {
  const { data: complaints, isLoading } = useComplaints();
  const updateComplaint = useUpdateComplaint();
  const [filter, setFilter] = useState<string>("all");

  if (isLoading || !complaints) {
    return (
      <PortalShell role="warden" eyebrow="Maintenance" title="Complaints board">
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading complaints...</div>
        </div>
      </PortalShell>
    );
  }

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                  <Card key={c.id} className="!p-4 flex flex-col justify-between min-h-[160px]">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-[10px] text-muted-foreground tabular">{c.id}</div>
                        <StatusChip label={c.priority} tone={c.priority === "urgent" || c.priority === "high" ? "danger" : "warning"} />
                      </div>
                      <div className="mt-2 font-medium leading-snug">{c.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{c.category} · {c.submittedBy}</div>
                      {c.description ? (
                        <div className="mt-2 text-[11px] text-muted-foreground line-clamp-2" title={c.description}>
                          {c.description}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <div className="hairline my-3" />
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{c.assignee || "Unassigned"}</span>
                        <span className="font-mono tabular">{c.updatedAt}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 flex flex-wrap gap-1 border-t border-border/40 pt-2.5">
                        {c.status === "open" && (
                          <>
                            <button
                              onClick={() => updateComplaint.mutate({ id: c.id, status: "assigned", assignee: "Warden staff" })}
                              className="rounded bg-amber/10 hover:bg-amber/20 px-2 py-1 text-[10px] font-semibold text-amber transition cursor-pointer"
                            >
                              Assign
                            </button>
                            <button
                              onClick={() => updateComplaint.mutate({ id: c.id, status: "resolved" })}
                              className="rounded bg-[color:var(--success)]/10 hover:bg-[color:var(--success)]/20 px-2 py-1 text-[10px] font-semibold text-[color:var(--success)] transition cursor-pointer"
                            >
                              Resolve
                            </button>
                          </>
                        )}
                        {c.status === "assigned" && (
                          <>
                            <button
                              onClick={() => updateComplaint.mutate({ id: c.id, status: "in_progress" })}
                              className="rounded bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 text-[10px] font-semibold text-blue-400 transition cursor-pointer"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => updateComplaint.mutate({ id: c.id, status: "resolved" })}
                              className="rounded bg-[color:var(--success)]/10 hover:bg-[color:var(--success)]/20 px-2 py-1 text-[10px] font-semibold text-[color:var(--success)] transition cursor-pointer"
                            >
                              Resolve
                            </button>
                          </>
                        )}
                        {c.status === "in_progress" && (
                          <button
                            onClick={() => updateComplaint.mutate({ id: c.id, status: "resolved" })}
                            className="rounded bg-[color:var(--success)]/10 hover:bg-[color:var(--success)]/20 px-2 py-1 text-[10px] font-semibold text-[color:var(--success)] transition cursor-pointer"
                          >
                            Mark Done
                          </button>
                        )}
                        {c.status === "resolved" && (
                          <button
                            onClick={() => updateComplaint.mutate({ id: c.id, status: "closed" })}
                            className="rounded bg-gray-500/15 hover:bg-gray-500/25 px-2 py-1 text-[10px] font-semibold text-muted-foreground transition cursor-pointer"
                          >
                            Close
                          </button>
                        )}
                        {c.status === "closed" && (
                          <button
                            onClick={() => updateComplaint.mutate({ id: c.id, status: "open" })}
                            className="rounded bg-amber/10 hover:bg-amber/20 px-2 py-1 text-[10px] font-semibold text-amber transition cursor-pointer"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
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
