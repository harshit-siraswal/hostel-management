import { createFileRoute, Outlet, useRouterState, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { KpiCard } from "@/components/hostel/kpi-card";
import { Card, Section } from "@/components/hostel/primitives";
import { kpis } from "@/lib/hostel-data";
import { ArrowRight, Download } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Bunkhaus" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/admin") return <Outlet />;
  return <AdminDashboard />;
}

// Tiny inline sparkline / bar visual (no chart deps) — editorial feel.
function Bars({ values, tone = "amber" }: { values: number[]; tone?: "amber" | "teal" | "coral" }) {
  const max = Math.max(...values);
  const color = tone === "amber" ? "bg-amber" : tone === "teal" ? "bg-[color:var(--teal)]" : "bg-[color:var(--coral)]";
  return (
    <div className="flex h-24 items-end gap-1.5">
      {values.map((v, i) => (
        <div key={i} className={`${color} flex-1 rounded-t opacity-80 transition hover:opacity-100`} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

function AdminDashboard() {
  return (
    <PortalShell
      role="admin"
      eyebrow="Institution · Cycle Jun 2026"
      title="Control dashboard"
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-card/80">
          <Download className="h-3.5 w-3.5" /> Export report
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.admin.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-amber">Collections · weekly</div>
              <div className="mt-1 font-display text-2xl">Fee inflow</div>
            </div>
            <div className="text-xs text-muted-foreground tabular">₹4.2 cr · this month</div>
          </div>
          <div className="mt-6">
            <Bars values={[18, 24, 21, 30, 27, 33, 36, 31, 40, 42, 38, 44]} tone="amber" />
          </div>
          <div className="hairline my-4" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Collected</div>
              <div className="font-display text-xl tabular text-[color:var(--success)]">₹3.88 cr</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Outstanding</div>
              <div className="font-display text-xl tabular text-[color:var(--warning)]">₹32.1 L</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Overdue</div>
              <div className="font-display text-xl tabular text-[color:var(--danger)]">₹4.9 L</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-[10px] uppercase tracking-[0.22em] text-amber">Occupancy</div>
          <div className="mt-1 font-display text-2xl">Trend</div>
          <div className="mt-6">
            <Bars values={[62, 65, 70, 73, 78, 80, 84, 86, 87]} tone="teal" />
          </div>
          <div className="hairline my-4" />
          <div className="space-y-2 text-sm">
            <Row label="Block A" v="64%" />
            <Row label="Block B" v="81%" />
            <Row label="Block C" v="96%" warn />
          </div>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Section title="Open escalations" className="lg:col-span-2">
          <Card className="!p-0">
            <ul className="divide-y divide-border">
              {[
                { id: "esc-09", t: "Block C water leakage", o: "12h SLA breach", tone: "text-[color:var(--danger)]" },
                { id: "esc-08", t: "Fee defaulters → 38 students", o: "Reminder cycle 3", tone: "text-[color:var(--warning)]" },
                { id: "esc-07", t: "AI verification failures spiking", o: "Gate 2 · last 2h", tone: "text-[color:var(--warning)]" },
                { id: "esc-06", t: "Mess vendor invoice mismatch", o: "Finance review", tone: "text-muted-foreground" },
              ].map((e) => (
                <li key={e.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-3 p-4 sm:p-5">
                  <div className="font-mono text-xs text-muted-foreground tabular">{e.id}</div>
                  <div>
                    <div className="text-sm font-medium">{e.t}</div>
                    <div className={`text-xs ${e.tone}`}>{e.o}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-4 text-right">
              <Link to="/admin/alerts" className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline">
                All alerts <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        </Section>

        <Section title="AI verification">
          <Card>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Success rate</div>
            <div className="mt-1 font-display text-5xl tabular text-amber">96.1%</div>
            <div className="mt-1 text-xs text-muted-foreground">last 24h · 2,418 checks</div>
            <div className="mt-5">
              <Bars values={[92, 94, 91, 95, 96, 97, 96, 98]} tone="coral" />
            </div>
            <div className="hairline my-4" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Row label="Manual" v="3.1%" />
              <Row label="Failed" v="0.8%" />
            </div>
          </Card>
        </Section>
      </div>
    </PortalShell>
  );
}

function Row({ label, v, warn }: { label: string; v: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono tabular ${warn ? "text-[color:var(--warning)]" : ""}`}>{v}</span>
    </div>
  );
}
