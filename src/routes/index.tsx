import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Building2, ShieldCheck, BarChart3, BedDouble,
  Wrench, Users, Receipt, Sparkles, AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bunkhaus — Hostel Operations OS" },
      { name: "description", content: "A ledger-grade hostel management platform for colleges. Rooms, billing, complaints, leave, visitors and AI gate verification — one calm operating system." },
    ],
  }),
  component: Landing,
});

const ROLES = [
  { to: "/student", label: "Student", desc: "Room, bills, complaints, leave, visitor passes.", tag: "Resident" },
  { to: "/guest", label: "Visitor", desc: "Show your pass, host details and validity window.", tag: "Guest" },
  { to: "/warden", label: "Warden", desc: "Daily ops: queues, approvals, occupancy, AI review.", tag: "Operations" },
  { to: "/admin", label: "Admin", desc: "Institutional metrics, collections, escalations, reports.", tag: "Control" },
];

function Landing() {
  return (
    <div className="relative min-h-screen">
      <div className="ledger-grid pointer-events-none fixed inset-0 opacity-[0.15]" />

      {/* Nav */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-amber text-amber-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg">Bunkhaus</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Hostel OS · v3.2</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#capabilities" className="hover:text-foreground">Capabilities</a>
            <a href="#portals" className="hover:text-foreground">Portals</a>
            <a href="#operations" className="hover:text-foreground">Operations</a>
          </nav>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-semibold text-amber-foreground transition hover:brightness-110"
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-14 pb-24">
        <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-amber" /> Built for residential life · 2026 edition
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              The quiet <span className="text-amber">operating system</span>
              <br /> for your hostel.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Bunkhaus turns gate logs, room ledgers, complaints, leave slips and
              billing cycles into one calm, role-aware workspace. Designed like a
              well-bound register — engineered for the next decade of campus life.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-md bg-amber px-5 py-3 text-sm font-semibold text-amber-foreground transition hover:brightness-110"
              >
                Enter portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/warden"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-5 py-3 text-sm font-semibold hover:bg-card"
              >
                See warden console
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { k: "12,400+", v: "Residents managed" },
                { k: "96.1%", v: "AI gate match rate" },
                { k: "₹4.2 cr", v: "Fees reconciled / mo" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-3xl tabular">{s.k}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual: ledger preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber/20 via-teal/10 to-transparent blur-2xl" />
            <div className="glass-card relative rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">Warden · Live</div>
                  <div className="font-display text-xl">Today's ledger</div>
                </div>
                <div className="chip">07:42 IST</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { l: "Occupancy", v: "87%", t: "Block C 96%" },
                  { l: "Gate events", v: "412", t: "peak 11:00" },
                  { l: "Complaints", v: "14", t: "4 urgent" },
                  { l: "AI matches", v: "96.1%", t: "manual: 11" },
                ].map((m) => (
                  <div key={m.l} className="rounded-lg border border-border/70 bg-background/40 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{m.l}</div>
                    <div className="mt-1 font-display text-2xl tabular">{m.v}</div>
                    <div className="text-[11px] text-muted-foreground tabular">{m.t}</div>
                  </div>
                ))}
              </div>

              <div className="hairline my-5" />

              <div className="space-y-2.5 text-sm">
                {[
                  { t: "10:04", n: "Visitor Sunita M. · manual review", tone: "text-[color:var(--warning)]" },
                  { t: "10:11", n: "Leave lr-770 approved · Riya Shah", tone: "text-[color:var(--success)]" },
                  { t: "10:18", n: "Complaint c-2050 raised · mess leakage", tone: "text-[color:var(--danger)]" },
                  { t: "10:22", n: "Bill b1 reminder sent · 412 students", tone: "text-muted-foreground" },
                ].map((e) => (
                  <div key={e.t} className="grid grid-cols-[56px_1fr] items-baseline gap-3">
                    <div className="font-mono text-xs text-muted-foreground tabular">{e.t}</div>
                    <div className={e.tone}>{e.n}</div>
                  </div>
                ))}
              </div>

              <div className="hairline my-5" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-[color:var(--warning)]" />
                  Block C nearing 95% capacity
                </span>
                <span className="font-mono">page 1 of 14</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="relative z-10 border-t border-border bg-background/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">01 — Capabilities</div>
              <h2 className="mt-2 max-w-2xl font-display text-4xl">Every part of residential life, in one ledger.</h2>
            </div>
            <div className="hidden text-sm text-muted-foreground md:block">Engineered for wardens · loved by students</div>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {[
              { i: BedDouble, t: "Rooms & allocation", d: "Block-by-block bed maps, conflicts, maintenance and capacity warnings." },
              { i: Receipt, t: "Billing & dues", d: "Hostel, electricity and mess charges with paid · due · overdue states." },
              { i: Wrench, t: "Complaints", d: "Categorised tickets with priority, assignment and resolution history." },
              { i: Users, t: "Visitors & gate", d: "Pre-approved passes, validity windows and live entry/exit logs." },
              { i: ShieldCheck, t: "AI verification", d: "Face match with confidence, manual review and policy-aware fallback." },
              { i: BarChart3, t: "Analytics", d: "Collections, occupancy trends, SLA breaches and exportable reports." },
            ].map((c) => (
              <div key={c.t} className="bg-background p-7">
                <c.i className="h-5 w-5 text-amber" />
                <div className="mt-4 font-display text-xl">{c.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals */}
      <section id="portals" className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">02 — Portals</div>
          <h2 className="mt-2 font-display text-4xl">Pick a vantage point.</h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r, i) => (
              <Link
                key={r.to}
                to={r.to}
                className="glass-card group relative overflow-hidden rounded-xl p-6 transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="chip">{r.tag}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">0{i + 1}</div>
                </div>
                <div className="mt-8 font-display text-3xl">{r.label}</div>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-amber">
                  Enter portal <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-amber/10 blur-3xl transition group-hover:bg-amber/20" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Operations footer */}
      <section id="operations" className="relative z-10 border-t border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">03 — Operations</div>
            <h3 className="mt-2 font-display text-3xl">A frontend that feels like a system of record.</h3>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Bunkhaus is built as a frontend layer over your existing hostel APIs.
              Plug in your endpoints, or run the prototype mode with local data
              to demo any of the four portals end to end.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex w-fit items-center gap-2 rounded-md bg-amber px-5 py-3 text-sm font-semibold text-amber-foreground hover:brightness-110"
          >
            Sign in to a portal <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
            <div>© 2026 Bunkhaus · Residential operations, gently engineered.</div>
            <div className="font-mono">build · ledger.3.2.1</div>
          </div>
        </div>
      </section>
    </div>
  );
}
