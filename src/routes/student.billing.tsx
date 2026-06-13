import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card, Section } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { useBills } from "@/lib/data-layer";

export const Route = createFileRoute("/student/billing")({
  head: () => ({ meta: [{ title: "Billing — Bunkhaus" }] }),
  component: BillingPage,
});

function BillingPage() {
  const { data: bills, isLoading } = useBills();

  if (isLoading || !bills) {
    return (
      <PortalShell role="student" eyebrow="Ledger" title="Billing">
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading billing ledger...</div>
        </div>
      </PortalShell>
    );
  }

  const outstanding = bills.filter((b) => b.status !== "paid").reduce((s, b) => s + b.total, 0);
  const current = bills[0] || { total: 0, dueDate: "N/A", status: "paid", period: "N/A" };

  return (
    <PortalShell role="student" eyebrow="Ledger" title="Billing">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Outstanding</div>
          <div className="mt-2 font-display text-4xl tabular text-[color:var(--warning)]">₹{outstanding.toLocaleString()}</div>
          <div className="mt-1 text-xs text-muted-foreground">across {bills.filter((b) => b.status !== "paid").length} bills</div>
        </Card>
        <Card>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Current cycle</div>
          <div className="mt-2 font-display text-4xl tabular">₹{current.total.toLocaleString()}</div>
          <div className="mt-1 text-xs text-muted-foreground tabular">Due {current.dueDate}</div>
        </Card>
        <Card>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Status</div>
          <div className="mt-2"><StatusChip label={prettyStatus(current.status)} tone={statusTone(current.status)} /></div>
          <button className="mt-4 w-full rounded-md bg-amber px-4 py-2 text-sm font-semibold text-amber-foreground hover:brightness-110">
            Pay ₹{current.total.toLocaleString()}
          </button>
        </Card>
      </div>

      <Section title="Bill ledger" className="mt-8">
        <Card className="!p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-3">Period</th>
                <th className="px-5 py-3 text-right">Hostel</th>
                <th className="px-5 py-3 text-right">Electricity</th>
                <th className="px-5 py-3 text-right">Mess</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular">
              {bills.map((b) => (
                <tr key={b.id} className="transition hover:bg-card/60">
                  <td className="px-5 py-4 font-medium">{b.period}</td>
                  <td className="px-5 py-4 text-right text-muted-foreground">₹{b.hostelFee.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-muted-foreground">₹{b.electricity.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-muted-foreground">₹{b.mess.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right font-semibold">₹{b.total.toLocaleString()}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{b.dueDate}</td>
                  <td className="px-5 py-4"><StatusChip label={prettyStatus(b.status)} tone={statusTone(b.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>
    </PortalShell>
  );
}
