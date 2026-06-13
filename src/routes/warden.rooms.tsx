import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card } from "@/components/hostel/primitives";
import { StatusChip } from "@/components/hostel/status-chip";
import { useRooms } from "@/lib/data-layer";

export const Route = createFileRoute("/warden/rooms")({
  head: () => ({ meta: [{ title: "Warden · Rooms" }] }),
  component: RoomsPage,
});

function RoomsPage() {
  const { data: rooms, isLoading } = useRooms();

  if (isLoading || !rooms) {
    return (
      <PortalShell role="warden" eyebrow="Allocation" title="Rooms & occupancy">
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading rooms...</div>
        </div>
      </PortalShell>
    );
  }

  const blocks = Array.from(new Set(rooms.map((r) => r.block)));
  return (
    <PortalShell role="warden" eyebrow="Allocation" title="Rooms & occupancy">
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((b) => {
          const inBlock = rooms.filter((r) => r.block === b);
          const cap = inBlock.reduce((s, r) => s + r.capacity, 0);
          const occ = inBlock.reduce((s, r) => s + r.occupancy, 0);
          const pct = Math.round((occ / cap) * 100);
          return (
            <Card key={b}>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{b}</div>
              <div className="mt-1 font-display text-3xl tabular">{pct}%</div>
              <div className="text-xs text-muted-foreground tabular">{occ} / {cap} beds</div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${pct > 90 ? "bg-[color:var(--danger)]" : pct > 75 ? "bg-[color:var(--warning)]" : "bg-[color:var(--info)]"}`} style={{ width: `${pct}%` }} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((r) => {
          const tone = r.status === "full" ? "danger" : r.status === "partial" ? "warning" : r.status === "maintenance" ? "neutral" : "info";
          return (
            <Card key={r.id} className="!p-4">
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs text-muted-foreground tabular">{r.block}</div>
                <StatusChip label={r.status} tone={tone as any} />
              </div>
              <div className="mt-2 font-display text-2xl tabular">{r.number}</div>
              <div className="mt-1 text-xs text-muted-foreground tabular">{r.occupancy} / {r.capacity} occupied</div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: r.capacity }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${i < r.occupancy ? "bg-amber" : "bg-muted"}`}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </PortalShell>
  );
}
