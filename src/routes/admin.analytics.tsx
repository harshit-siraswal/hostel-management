import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card, Section } from "@/components/hostel/primitives";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Admin · Analytics" }] }),
  component: AnalyticsPage,
});

function Heatmap() {
  // 7 x 24 grid of pseudo-random intensities for gate traffic
  const cells = Array.from({ length: 7 * 24 }).map((_, i) => {
    const hour = i % 24;
    // synthetic peaks at 8 and 18
    const base = Math.exp(-((hour - 8) ** 2) / 12) + Math.exp(-((hour - 18) ** 2) / 10);
    return Math.min(1, base * (0.6 + (i % 5) * 0.08));
  });
  return (
    <div className="grid grid-cols-24 gap-0.5" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
      {cells.map((v, i) => (
        <div
          key={i}
          className="aspect-square rounded-[2px]"
          style={{ backgroundColor: `color-mix(in oklab, var(--amber) ${Math.round(v * 80)}%, var(--card))` }}
          title={`Hr ${i % 24}`}
        />
      ))}
    </div>
  );
}

function Donut({ value }: { value: number }) {
  const r = 56, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 140 140" className="h-44 w-44">
      <circle cx="70" cy="70" r={r} fill="none" stroke="color-mix(in oklab, var(--rule) 50%, transparent)" strokeWidth="14" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="oklch(0.78 0.15 70)" strokeWidth="14" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 70 70)" />
      <text x="70" y="74" textAnchor="middle" fill="currentColor" fontFamily="Fraunces, serif" fontSize="28">{value}%</text>
    </svg>
  );
}

function AnalyticsPage() {
  return (
    <PortalShell role="admin" eyebrow="Reports" title="Analytics">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Section title="Gate traffic · last 7 days">
          <Card>
            <Heatmap />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
            </div>
          </Card>
        </Section>

        <Section title="Collection rate">
          <Card className="flex items-center justify-between gap-4">
            <Donut value={92} />
            <div className="text-sm">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">June cycle</div>
              <div className="font-display text-2xl tabular">₹3.88 cr</div>
              <div className="hairline my-3" />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Paid</span><span className="font-mono tabular">92.4%</span></div>
                <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Due</span><span className="font-mono tabular">6.4%</span></div>
                <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Overdue</span><span className="font-mono tabular text-[color:var(--danger)]">1.2%</span></div>
              </div>
            </div>
          </Card>
        </Section>
      </div>

      <Section title="Reports" className="mt-10">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { t: "Occupancy report", d: "Block-wise occupancy and bed turnover.", n: "12 pages" },
            { t: "Collections report", d: "Fee, electricity, mess — cycle breakdown.", n: "8 pages" },
            { t: "Complaints report", d: "SLA, category mix, repeat offenders.", n: "6 pages" },
          ].map((r) => (
            <Card key={r.t}>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Report</div>
              <div className="mt-1 font-display text-xl">{r.t}</div>
              <div className="text-sm text-muted-foreground">{r.d}</div>
              <div className="hairline my-4" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground tabular">{r.n}</span>
                <button className="rounded-md bg-amber px-3 py-1.5 font-semibold text-amber-foreground hover:brightness-110">Download CSV</button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </PortalShell>
  );
}
