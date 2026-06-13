import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card, Section } from "@/components/hostel/primitives";
import { rooms } from "@/lib/hostel-data";

export const Route = createFileRoute("/admin/occupancy")({
  head: () => ({ meta: [{ title: "Admin · Occupancy" }] }),
  component: OccupancyPage,
});

function OccupancyPage() {
  const blocks = Array.from(new Set(rooms.map((r) => r.block)));
  return (
    <PortalShell role="admin" eyebrow="Residences" title="Occupancy">
      <Section title="By block">
        <div className="grid gap-4 md:grid-cols-3">
          {blocks.map((b) => {
            const inBlock = rooms.filter((r) => r.block === b);
            const cap = inBlock.reduce((s, r) => s + r.capacity, 0);
            const occ = inBlock.reduce((s, r) => s + r.occupancy, 0);
            const pct = Math.round((occ / cap) * 100);
            return (
              <Card key={b}>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{b}</div>
                <div className="mt-1 font-display text-4xl tabular">{pct}%</div>
                <div className="text-xs text-muted-foreground tabular">{occ} / {cap} beds</div>
                <div className="mt-4 grid grid-cols-6 gap-1">
                  {inBlock.flatMap((r) =>
                    Array.from({ length: r.capacity }).map((_, i) => (
                      <div key={`${r.id}-${i}`} className={`h-3 rounded-sm ${i < r.occupancy ? "bg-amber" : "bg-muted"}`} />
                    )),
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </PortalShell>
  );
}
