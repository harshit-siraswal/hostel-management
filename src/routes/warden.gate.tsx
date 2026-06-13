import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card, Section } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { useGateEvents } from "@/lib/data-layer";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

export const Route = createFileRoute("/warden/gate")({
  head: () => ({ meta: [{ title: "Warden · Gate & AI" }] }),
  component: GateAIPage,
});

const STATES = [
  { id: "matched", label: "Matched", icon: ShieldCheck, tone: "success" as const, desc: "High-confidence face match. Auto-allowed." },
  { id: "manual_review", label: "Manual review", icon: ShieldAlert, tone: "warning" as const, desc: "Confidence below threshold — guard verifies ID." },
  { id: "low_confidence", label: "Low confidence", icon: ShieldAlert, tone: "warning" as const, desc: "Lighting/angle issues. Re-capture suggested." },
  { id: "failed", label: "Failed", icon: ShieldX, tone: "danger" as const, desc: "No match. Entry held pending warden approval." },
];

function GateAIPage() {
  const { data: gateEvents, isLoading } = useGateEvents();

  if (isLoading || !gateEvents) {
    return (
      <PortalShell role="warden" eyebrow="Identity" title="Gate & AI verification">
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading gate events...</div>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell role="warden" eyebrow="Identity" title="Gate & AI verification">
      <Section title="Verification states">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {STATES.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.tone === "success" ? "text-[color:var(--success)]" : s.tone === "warning" ? "text-[color:var(--warning)]" : "text-[color:var(--danger)]"}`} />
                <StatusChip label={s.label} tone={s.tone} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Live gate stream" className="mt-10">
        <Card className="!p-0">
          <ul className="divide-y divide-border">
            {gateEvents.map((g) => {
              const tone = statusTone(g.verification);
              return (
                <li key={g.id} className="grid grid-cols-[50px_1fr_140px_120px_auto] items-center gap-3 p-4 sm:p-5">
                  <div className="font-mono text-xs text-muted-foreground tabular">{g.time}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{g.name}</div>
                    <div className="text-xs text-muted-foreground">{g.direction === "in" ? "Entry" : "Exit"} · {Math.round(g.confidence * 100)}% confidence</div>
                  </div>
                  <div className="hidden h-1.5 overflow-hidden rounded-full bg-muted sm:block">
                    <div className={`h-full ${tone === "success" ? "bg-[color:var(--success)]" : tone === "warning" ? "bg-[color:var(--warning)]" : "bg-[color:var(--danger)]"}`} style={{ width: `${g.confidence * 100}%` }} />
                  </div>
                  <StatusChip label={prettyStatus(g.verification)} tone={tone} />
                  <div className="flex gap-2">
                    {g.verification !== "matched" && (
                      <>
                        <button className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-card">Hold</button>
                        <button className="rounded-md bg-amber px-3 py-1.5 text-xs font-semibold text-amber-foreground hover:brightness-110">Allow</button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
        <div className="mt-3 text-xs text-muted-foreground">
          AI is a recommendation layer. Manual verification is always available — biometrics never block entry.
        </div>
      </Section>
    </PortalShell>
  );
}
