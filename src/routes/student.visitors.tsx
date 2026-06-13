import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card, Section } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { currentStudent, visitors as seed, type VisitorRequest } from "@/lib/hostel-data";
import { QrCode, UserPlus } from "lucide-react";

export const Route = createFileRoute("/student/visitors")({
  head: () => ({ meta: [{ title: "Visitors — Bunkhaus" }] }),
  component: VisitorsPage,
});

function VisitorsPage() {
  const [list, setList] = useState<VisitorRequest[]>(seed);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Parent");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !from || !to) return;
    setList((l) => [{
      id: `v-${Math.floor(Math.random() * 900 + 100)}`,
      visitor: name, relation, host: currentStudent.name, hostRoom: currentStudent.room,
      validFrom: from, validTo: to, status: "pending",
    }, ...l]);
    setName(""); setFrom(""); setTo("");
  };

  return (
    <PortalShell role="student" eyebrow="Gate" title="Visitor passes">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Section title="Register a visitor">
          <Card>
            <form onSubmit={submit} className="space-y-4">
              <Field label="Visitor name">
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
              </Field>
              <Field label="Relation">
                <select value={relation} onChange={(e) => setRelation(e.target.value)} className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber">
                  {["Parent", "Sibling", "Relative", "Friend", "Other"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Valid from">
                  <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} required className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
                </Field>
                <Field label="Valid until">
                  <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} required className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
                </Field>
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-semibold text-amber-foreground hover:brightness-110">
                <UserPlus className="h-4 w-4" /> Request pass
              </button>
            </form>
          </Card>
        </Section>

        <Section title="Passes">
          <div className="grid gap-3">
            {list.map((v) => (
              <Card key={v.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-muted-foreground tabular">{v.passCode || v.id}</div>
                    <div className="mt-1 font-display text-xl">{v.visitor} <span className="text-muted-foreground">· {v.relation}</span></div>
                    <div className="mt-1 text-sm text-muted-foreground tabular">Host: {v.host} · {v.hostRoom}</div>
                    <div className="text-xs text-muted-foreground tabular">{v.validFrom} → {v.validTo}</div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <StatusChip label={prettyStatus(v.status)} tone={statusTone(v.status)} />
                    <div className="grid h-16 w-16 place-items-center rounded-md border border-border bg-background/60">
                      <QrCode className="h-8 w-8 text-amber" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
