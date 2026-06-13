import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card, Section } from "@/components/hostel/primitives";
import { StatusChip } from "@/components/hostel/status-chip";
import { AlertTriangle, BellRing, Users, Wrench } from "lucide-react";

export const Route = createFileRoute("/admin/alerts")({
  head: () => ({ meta: [{ title: "Admin · Alerts" }] }),
  component: AlertsPage,
});

const ALERTS = [
  { id: "al-22", t: "Block C occupancy 96%", d: "Within 2% of crowd-alert threshold.", level: "warning" as const, icon: AlertTriangle, time: "07:18" },
  { id: "al-21", t: "Peak gate traffic at 11:00", d: "412 events in the last hour. Two manual reviews.", level: "warning" as const, icon: Users, time: "11:04" },
  { id: "al-20", t: "Complaint spike in Plumbing", d: "5 new tickets in 30 minutes — Block C, 2nd floor.", level: "danger" as const, icon: Wrench, time: "10:51" },
  { id: "al-19", t: "AI verification dipped to 91%", d: "Likely lighting issue at Gate 2.", level: "warning" as const, icon: BellRing, time: "09:32" },
];

function AlertsPage() {
  return (
    <PortalShell role="admin" eyebrow="Operations" title="Alerts & crowd signals">
      <Section title="Active alerts">
        <div className="grid gap-3">
          {ALERTS.map((a) => (
            <Card key={a.id}>
              <div className="flex items-start gap-4">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${a.level === "danger" ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]" : "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-xs text-muted-foreground tabular">{a.id}</div>
                    <StatusChip label={a.level} tone={a.level} />
                  </div>
                  <div className="mt-1 font-display text-lg">{a.t}</div>
                  <div className="text-sm text-muted-foreground">{a.d}</div>
                </div>
                <div className="font-mono text-xs text-muted-foreground tabular">{a.time}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Crowd thresholds" className="mt-10">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { l: "Block A", t: 92, c: 64 },
            { l: "Block B", t: 92, c: 81 },
            { l: "Block C", t: 92, c: 96 },
          ].map((b) => (
            <Card key={b.l}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{b.l}</span>
                <span className="font-mono tabular text-muted-foreground">threshold {b.t}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${b.c >= b.t ? "bg-[color:var(--danger)]" : "bg-amber"}`} style={{ width: `${b.c}%` }} />
              </div>
              <div className="mt-2 font-mono text-xs tabular text-muted-foreground">current {b.c}%</div>
            </Card>
          ))}
        </div>
      </Section>
    </PortalShell>
  );
}
