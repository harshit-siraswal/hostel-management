import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { KpiCard } from "@/components/hostel/kpi-card";
import { Card, Section } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { bills, complaints, currentStudent, kpis, leaveRequests, notices, visitors } from "@/lib/hostel-data";
import { ArrowRight, BedDouble, BellRing, Plus, Receipt } from "lucide-react";

export const Route = createFileRoute("/student")({
  head: () => ({ meta: [{ title: "Student — Bunkhaus" }] }),
  component: StudentLayout,
});

function StudentLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/student") return <Outlet />;
  return <StudentOverview />;
}

function StudentOverview() {
  const leave = leaveRequests.find((l) => l.student === currentStudent.name);
  const openComplaints = complaints.filter((c) => c.submittedBy === currentStudent.name && c.status !== "resolved" && c.status !== "closed");
  const visitor = visitors.find((v) => v.host === currentStudent.name);
  const currentBill = bills[0];

  return (
    <PortalShell
      role="student"
      eyebrow={`Welcome back, ${currentStudent.name.split(" ")[0]}`}
      title="Your hostel ledger"
      actions={
        <Link to="/student/complaints" className="inline-flex items-center gap-1.5 rounded-md bg-amber px-3 py-2 text-xs font-semibold text-amber-foreground hover:brightness-110">
          <Plus className="h-3.5 w-3.5" /> New complaint
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.student.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Room assignment</div>
              <div className="mt-1 font-display text-3xl">{currentStudent.room} · <span className="text-muted-foreground">Bed {currentStudent.bed}</span></div>
              <div className="mt-1 text-sm text-muted-foreground">{currentStudent.hostel} · {currentStudent.course}, Year {currentStudent.year}</div>
            </div>
            <BedDouble className="h-6 w-6 text-amber" />
          </div>
          <div className="hairline my-5" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <Detail label="Roll no." value={currentStudent.roll} />
            <Detail label="Block" value={currentStudent.hostel.split("—")[0].trim()} />
            <Detail label="Move-in" value="12 Aug 2024" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current bill · {currentBill.period}</div>
              <div className="mt-1 font-display text-3xl tabular">₹{currentBill.total.toLocaleString()}</div>
              <div className="mt-1 text-sm text-muted-foreground tabular">Due {currentBill.dueDate}</div>
            </div>
            <Receipt className="h-6 w-6 text-amber" />
          </div>
          <div className="hairline my-5" />
          <div className="flex items-center justify-between">
            <StatusChip label={prettyStatus(currentBill.status)} tone={statusTone(currentBill.status)} />
            <Link to="/student/billing" className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline">
              View ledger <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <Section title="Open complaints" className="lg:col-span-2">
          <Card className="!p-0">
            <ul className="divide-y divide-border">
              {openComplaints.length === 0 ? (
                <li className="p-6 text-sm text-muted-foreground">No open complaints. Everything's working.</li>
              ) : openComplaints.map((c) => (
                <li key={c.id} className="grid grid-cols-[1fr_auto] items-center gap-3 p-4 sm:grid-cols-[80px_1fr_auto_auto] sm:p-5">
                  <div className="hidden font-mono text-xs text-muted-foreground tabular sm:block">{c.id}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.category} · updated {c.updatedAt}</div>
                  </div>
                  <StatusChip label={c.priority} tone={c.priority === "urgent" || c.priority === "high" ? "danger" : "warning"} />
                  <StatusChip label={prettyStatus(c.status)} tone={statusTone(c.status)} />
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        <Section title="Notices">
          <Card className="!p-0">
            <ul className="divide-y divide-border">
              {notices.map((n) => (
                <li key={n.id} className="flex items-start gap-3 p-4">
                  <BellRing className={`mt-0.5 h-4 w-4 ${n.level === "danger" ? "text-[color:var(--danger)]" : n.level === "warning" ? "text-[color:var(--warning)]" : "text-[color:var(--info)]"}`} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.body}</div>
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground tabular">{n.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Section title="Leave request">
          <Card>
            {leave ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs text-muted-foreground">{leave.id}</div>
                  <StatusChip label={prettyStatus(leave.status)} tone={statusTone(leave.status)} />
                </div>
                <div className="mt-3 font-display text-xl">{leave.from} → {leave.to}</div>
                <div className="text-sm text-muted-foreground">{leave.reason} · {leave.destination}</div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No active leave request.</div>
            )}
            <div className="hairline my-4" />
            <Link to="/student/leave" className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline">
              Manage leave <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>
        </Section>

        <Section title="Visitor pass">
          <Card>
            {visitor ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs text-muted-foreground">{visitor.passCode || visitor.id}</div>
                  <StatusChip label={prettyStatus(visitor.status)} tone={statusTone(visitor.status)} />
                </div>
                <div className="mt-3 font-display text-xl">{visitor.visitor}</div>
                <div className="text-sm text-muted-foreground">{visitor.relation} · {visitor.validFrom} → {visitor.validTo}</div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No active visitor pass.</div>
            )}
            <div className="hairline my-4" />
            <Link to="/student/visitors" className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline">
              Manage visitors <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>
        </Section>
      </div>
    </PortalShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono tabular">{value}</div>
    </div>
  );
}
