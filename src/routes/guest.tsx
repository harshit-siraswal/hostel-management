import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card } from "@/components/hostel/primitives";
import { VisitorQr } from "@/components/hostel/visitor-qr";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { useVisitors } from "@/lib/data-layer";
import { Clock, MapPin, ShieldCheck, User } from "lucide-react";

export const Route = createFileRoute("/guest")({
  head: () => ({ meta: [{ title: "Visitor Pass — Bunkhaus" }] }),
  component: GuestPortal,
});

function GuestPortal() {
  const { data: visitors, isLoading } = useVisitors();

  if (isLoading || !visitors || visitors.length === 0) {
    return (
      <PortalShell role="guest" eyebrow="Visitor portal" title="Your gate pass">
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading visitor passes...</div>
        </div>
      </PortalShell>
    );
  }

  const pass = visitors[0]; // primary active pass for the guest
  const history = visitors.slice(1);

  return (
    <PortalShell role="guest" eyebrow="Visitor portal" title="Your gate pass">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber/20 blur-3xl" />
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">Pass · {pass.passCode}</div>
              <div className="mt-1 font-display text-4xl">{pass.visitor}</div>
              <div className="text-sm text-muted-foreground">{pass.relation} · visiting {pass.host}</div>
            </div>
            <StatusChip label={prettyStatus(pass.status)} tone={statusTone(pass.status)} />
          </div>

          <div className="hairline my-6" />

          <div className="grid grid-cols-[1fr_auto] items-center gap-6">
            <div className="space-y-3 text-sm">
              <Row icon={<User className="h-4 w-4" />} label="Host" value={`${pass.host} · room ${pass.hostRoom}`} />
              <Row icon={<Clock className="h-4 w-4" />} label="Validity" value={`${pass.validFrom} → ${pass.validTo}`} />
              <Row icon={<MapPin className="h-4 w-4" />} label="Entry point" value="Main Gate · Block C lobby" />
              <Row icon={<ShieldCheck className="h-4 w-4" />} label="Verification" value="AI face-match · manual fallback allowed" />
            </div>
            <VisitorQr visitor={pass} size={144} caption="Scan-ready visitor QR" />
          </div>

          <div className="hairline my-6" />
          <div className="text-xs text-muted-foreground">
            Show this screen at the gate. The guard will scan the code and confirm your identity. Carry one photo ID.
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">AI verification</div>
            <div className="mt-1 font-display text-2xl">Match confidence</div>
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <div className="font-display text-5xl tabular text-amber">97%</div>
                <div className="text-xs text-muted-foreground">last check · 10:04</div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-gradient-to-r from-amber via-teal to-amber" style={{ width: "97%" }} />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                If AI is unavailable or your camera fails, the guard can verify with your ID — no biometric is mandatory.
              </div>
            </div>
          </Card>

          <Card className="!p-0">
            <div className="px-5 pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Entry / exit log</div>
            <ul className="mt-3 divide-y divide-border">
              {[
                { t: "10:04", a: "Entry · Main gate", v: "manual review" },
                { t: "12:48", a: "Exit · Main gate", v: "matched" },
              ].map((e) => (
                <li key={e.t} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 px-5 py-3 text-sm">
                  <div className="font-mono text-xs text-muted-foreground tabular">{e.t}</div>
                  <div>{e.a}</div>
                  <StatusChip label={prettyStatus(e.v)} tone={statusTone(e.v)} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Previous passes</div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {history.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-xs text-muted-foreground tabular">{p.passCode || p.id}</div>
                  <div className="mt-1 font-display text-lg">{p.visitor}</div>
                  <div className="text-xs text-muted-foreground tabular">{p.validFrom} → {p.validTo}</div>
                </div>
                <StatusChip label={prettyStatus(p.status)} tone={statusTone(p.status)} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[20px_90px_1fr] items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="font-mono text-sm tabular">{value}</div>
    </div>
  );
}
