import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card, Section } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { useLeaveRequests, useCreateLeaveRequest } from "@/lib/data-layer";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/student/leave")({
  head: () => ({ meta: [{ title: "Leave — Bunkhaus" }] }),
  component: LeavePage,
});

function LeavePage() {
  const { data: list, isLoading } = useLeaveRequests();
  const createLeave = useCreateLeaveRequest();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (isLoading || !list) {
    return (
      <PortalShell role="student" eyebrow="Out of campus" title="Leave requests">
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading leave requests...</div>
        </div>
      </PortalShell>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !reason) return;
    createLeave.mutate({ from, to, reason, destination }, {
      onSuccess: () => {
        setFrom(""); setTo(""); setReason(""); setDestination("");
        setSubmitted(true); setTimeout(() => setSubmitted(false), 2200);
      }
    });
  };

  return (
    <PortalShell role="student" eyebrow="Out of campus" title="Leave requests">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Section title="Request leave">
          <Card>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="From">
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
                </Field>
                <Field label="To">
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)} required className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
                </Field>
              </div>
              <Field label="Destination">
                <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="City or address" className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
              </Field>
              <Field label="Reason">
                <textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} required className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
              </Field>
              {submitted && (
                <div className="rounded-md border border-[color:var(--success)]/40 bg-[color:var(--success)]/10 px-3 py-2 text-sm text-[color:var(--success)]">
                  Request submitted to your warden.
                </div>
              )}
              <button type="submit" className="w-full rounded-md bg-amber px-4 py-2.5 text-sm font-semibold text-amber-foreground hover:brightness-110">
                Submit request
              </button>
            </form>
          </Card>
        </Section>

        <Section title="History">
          <Card className="!p-0">
            <ul className="divide-y divide-border">
              {list.length === 0 && <li className="p-6 text-sm text-muted-foreground">No leave requests yet.</li>}
              {list.map((l) => (
                <li key={l.id} className="grid grid-cols-[1fr_auto] items-start gap-3 p-5">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground tabular">{l.id}</div>
                    <div className="mt-1 flex items-center gap-2 font-display text-lg">
                      <CalendarDays className="h-4 w-4 text-amber" />
                      <span className="tabular">{l.from} → {l.to}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{l.reason}{l.destination ? ` · ${l.destination}` : ""}</div>
                  </div>
                  <StatusChip label={prettyStatus(l.status)} tone={statusTone(l.status)} />
                </li>
              ))}
            </ul>
          </Card>
        </Section>
      </div>
    </PortalShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
