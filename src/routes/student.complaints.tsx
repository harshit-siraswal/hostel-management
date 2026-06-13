import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PortalShell } from "@/components/hostel/portal-shell";
import { Card, EmptyState, Section } from "@/components/hostel/primitives";
import { StatusChip, statusTone, prettyStatus } from "@/components/hostel/status-chip";
import { useComplaints, useCreateComplaint } from "@/lib/data-layer";
import { Plus, Wrench, X } from "lucide-react";

export const Route = createFileRoute("/student/complaints")({
  head: () => ({ meta: [{ title: "Complaints — Bunkhaus" }] }),
  component: ComplaintsPage,
});

function ComplaintsPage() {
  const { data: list, isLoading } = useComplaints();
  const createComplaint = useCreateComplaint();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  if (isLoading || !list) {
    return (
      <PortalShell role="student" eyebrow="Maintenance" title="Your complaints">
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading complaints...</div>
        </div>
      </PortalShell>
    );
  }

  const filtered = list.filter((c) => (q ? (c.title + c.category).toLowerCase().includes(q.toLowerCase()) : true));

  return (
    <PortalShell
      role="student"
      eyebrow="Maintenance"
      title="Your complaints"
      actions={
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-md bg-amber px-3 py-2 text-xs font-semibold text-amber-foreground hover:brightness-110">
          <Plus className="h-3.5 w-3.5" /> New complaint
        </button>
      }
    >
      <div className="mb-5 flex items-center gap-3">
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or category…"
          className="w-full max-w-sm rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber"
        />
        <div className="text-xs text-muted-foreground tabular">{filtered.length} of {list.length}</div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Wrench className="h-6 w-6" />} title="No complaints yet" hint="Raise one when something needs attention — geyser, wifi, furniture, anything." />
      ) : (
        <Card className="!p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="transition hover:bg-card/60">
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground tabular">{c.id}</td>
                  <td className="px-5 py-4">{c.title}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.category}</td>
                  <td className="px-5 py-4"><StatusChip label={c.priority} tone={c.priority === "urgent" || c.priority === "high" ? "danger" : "warning"} /></td>
                  <td className="px-5 py-4"><StatusChip label={prettyStatus(c.status)} tone={statusTone(c.status)} /></td>
                  <td className="px-5 py-4 text-right font-mono text-xs text-muted-foreground tabular">{c.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Section title="How complaints move" className="mt-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {["open", "assigned", "in_progress", "resolved", "closed"].map((s, i) => (
            <div key={s} className="glass-card rounded-lg p-4">
              <div className="font-mono text-[10px] text-muted-foreground tabular">Step {i + 1}</div>
              <div className="mt-2"><StatusChip label={prettyStatus(s)} tone={statusTone(s)} /></div>
            </div>
          ))}
        </div>
      </Section>

      {open && (
        <NewComplaintModal
          onClose={() => setOpen(false)}
          onSubmit={(newC) => {
            createComplaint.mutate(newC, {
              onSuccess: () => setOpen(false),
            });
          }}
        />
      )}
    </PortalShell>
  );
}

function NewComplaintModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (c: { title: string; category: string; priority: string; description: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur" onClick={onClose}>
      <div className="glass-card w-full max-w-lg rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">New complaint</div>
            <h2 className="font-display text-2xl">Tell us what's wrong</h2>
          </div>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            onSubmit({ title, category, priority, description });
          }}
        >
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber">
                {["Plumbing", "Electrical", "Networking", "Furniture", "Cleaning", "Mess", "Other"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber">
                {["low", "medium", "high", "urgent"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-amber" />
          </Field>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-card">Cancel</button>
            <button type="submit" className="rounded-md bg-amber px-4 py-2 text-sm font-semibold text-amber-foreground hover:brightness-110">Submit</button>
          </div>
        </form>
      </div>
    </div>
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
