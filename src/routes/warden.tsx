import { createFileRoute, Outlet, useRouterState, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { KpiCard } from "@/components/hostel/kpi-card";
import { Card, Section } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import {
  useComplaints,
  useLeaveRequests,
  useGateEvents,
  useDecideLeaveRequest,
  useKpis,
} from "@/lib/data-layer";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/warden")({
  head: () => ({ meta: [{ title: "Warden — Bunkhaus" }] }),
  component: WardenLayout,
});

function WardenLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/warden") return <Outlet />;
  return <WardenDashboard />;
}

function WardenDashboard() {
  const { data: complaints, isLoading: cLoading } = useComplaints();
  const { data: leaveRequests, isLoading: lLoading } = useLeaveRequests();
  const { data: gateEvents, isLoading: gLoading } = useGateEvents();
  const { data: kpisData, isLoading: kLoading } = useKpis("warden");
  const decideLeave = useDecideLeaveRequest();

  if (
    cLoading ||
    lLoading ||
    gLoading ||
    kLoading ||
    !complaints ||
    !leaveRequests ||
    !gateEvents ||
    !kpisData
  ) {
    return (
      <PortalShell role="warden" eyebrow="..." title="Loading operations console...">
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading operations console data...</div>
        </div>
      </PortalShell>
    );
  }

  const urgent = complaints.filter((c) => c.priority === "urgent" || c.priority === "high").slice(0, 5);
  const pendingLeave = leaveRequests.filter((l) => l.status === "pending");

  return (
    <PortalShell role="warden" eyebrow="Today · 13 Jun 2026" title="Operations console">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpisData.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Section title="Urgent queue" className="lg:col-span-2">
          <Card className="!p-0">
            <ul className="divide-y divide-border">
              {urgent.map((c) => (
                <li key={c.id} className="grid grid-cols-[1fr_auto] items-center gap-3 p-4 sm:grid-cols-[80px_1fr_140px_auto] sm:p-5">
                  <div className="hidden font-mono text-xs text-muted-foreground tabular sm:block">{c.id}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.category} · {c.submittedBy}</div>
                  </div>
                  <div className="hidden text-xs text-muted-foreground sm:block">{c.assignee || "Unassigned"}</div>
                  <div className="flex items-center gap-2">
                    <StatusChip label={c.priority} tone="danger" />
                    <StatusChip label={prettyStatus(c.status)} tone={statusTone(c.status)} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-4 text-right">
              <Link to="/warden/complaints" className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline">
                Open complaints board <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        </Section>

        <Section title="Capacity warnings">
          <Card>
            <div className="space-y-4">
              {[
                { block: "Block C — Tagore", pct: 96, tone: "danger" as const },
                { block: "Block B — Bose", pct: 81, tone: "warning" as const },
                { block: "Block A — Nehru", pct: 64, tone: "info" as const },
              ].map((b) => (
                <div key={b.block}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{b.block}</span>
                    <span className="font-mono tabular">{b.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full ${b.tone === "danger" ? "bg-[color:var(--danger)]" : b.tone === "warning" ? "bg-[color:var(--warning)]" : "bg-[color:var(--info)]"}`} style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="hairline pt-2" />
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-[color:var(--warning)]" />
                Block C will trigger a crowd alert at 98% — consider re-routing new allocations.
              </div>
            </div>
          </Card>
        </Section>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Section title="Leave approvals">
          <Card className="!p-0">
            <ul className="divide-y divide-border">
              {pendingLeave.map((l) => (
                <li key={l.id} className="grid grid-cols-[1fr_auto] items-center gap-3 p-5">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground tabular">{l.id}</div>
                    <div className="mt-1 font-medium">{l.student}</div>
                    <div className="text-xs text-muted-foreground tabular">{l.from} → {l.to} · {l.destination}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => decideLeave.mutate({ id: l.id, status: "rejected" })}
                      className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-card"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => decideLeave.mutate({ id: l.id, status: "approved" })}
                      className="rounded-md bg-amber px-3 py-1.5 text-xs font-semibold text-amber-foreground hover:brightness-110"
                    >
                      Approve
                    </button>
                  </div>
                </li>
              ))}
              {pendingLeave.length === 0 && <li className="p-6 text-sm text-muted-foreground">No pending approvals.</li>}
            </ul>
          </Card>
        </Section>

        <Section title="Gate · AI verification">
          <Card className="!p-0">
            <ul className="divide-y divide-border">
              {gateEvents.map((g) => (
                <li key={g.id} className="grid grid-cols-[44px_1fr_auto_auto] items-center gap-3 p-4 sm:p-5">
                  <div className="font-mono text-xs text-muted-foreground tabular">{g.time}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{g.name}</div>
                    <div className="text-xs text-muted-foreground">{g.direction === "in" ? "Entry" : "Exit"} · confidence {Math.round(g.confidence * 100)}%</div>
                  </div>
                  <StatusChip label={g.direction.toUpperCase()} tone={g.direction === "in" ? "info" : "neutral"} />
                  <StatusChip label={prettyStatus(g.verification)} tone={statusTone(g.verification)} />
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-border p-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-[color:var(--warning)]" />
                2 entries need manual override
              </span>
              <Link to="/warden/gate" className="font-semibold text-amber hover:underline">Open gate console →</Link>
            </div>
          </Card>
        </Section>
      </div>
    </PortalShell>
  );
}
