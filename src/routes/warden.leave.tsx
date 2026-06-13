import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { leaveRequests as seed, type LeaveRequest } from "@/lib/hostel-data";

export const Route = createFileRoute("/warden/leave")({
  head: () => ({ meta: [{ title: "Warden · Leave queue" }] }),
  component: WardenLeave,
});

function WardenLeave() {
  const [list, setList] = useState<LeaveRequest[]>(seed);
  const decide = (id: string, status: LeaveRequest["status"]) =>
    setList((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));

  return (
    <PortalShell role="warden" eyebrow="Approvals" title="Leave queue">
      <Card className="!p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Dates</th>
              <th className="px-5 py-3">Destination</th>
              <th className="px-5 py-3">Reason</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((l) => (
              <tr key={l.id} className="transition hover:bg-card/60">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground tabular">{l.id}</td>
                <td className="px-5 py-4 font-medium">{l.student}</td>
                <td className="px-5 py-4 font-mono text-xs tabular">{l.from} → {l.to}</td>
                <td className="px-5 py-4 text-muted-foreground">{l.destination}</td>
                <td className="px-5 py-4 text-muted-foreground">{l.reason}</td>
                <td className="px-5 py-4"><StatusChip label={prettyStatus(l.status)} tone={statusTone(l.status)} /></td>
                <td className="px-5 py-4 text-right">
                  {l.status === "pending" ? (
                    <div className="inline-flex gap-2">
                      <button onClick={() => decide(l.id, "rejected")} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-card">Reject</button>
                      <button onClick={() => decide(l.id, "approved")} className="rounded-md bg-amber px-3 py-1.5 text-xs font-semibold text-amber-foreground hover:brightness-110">Approve</button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PortalShell>
  );
}
