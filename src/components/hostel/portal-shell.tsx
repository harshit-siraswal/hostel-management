import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/hostel-data";
import {
  LayoutDashboard, Wrench, CalendarDays, Users, Receipt, BedDouble,
  ShieldCheck, BarChart3, BellRing, LogOut, Menu, X, Building2,
} from "lucide-react";
import { useState } from "react";

type NavItem = { label: string; to: string; icon: ReactNode };

const NAV: Record<Role, NavItem[]> = {
  student: [
    { label: "Overview", to: "/student", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Complaints", to: "/student/complaints", icon: <Wrench className="h-4 w-4" /> },
    { label: "Leave", to: "/student/leave", icon: <CalendarDays className="h-4 w-4" /> },
    { label: "Visitors", to: "/student/visitors", icon: <Users className="h-4 w-4" /> },
    { label: "Billing", to: "/student/billing", icon: <Receipt className="h-4 w-4" /> },
  ],
  guest: [
    { label: "My Pass", to: "/guest", icon: <ShieldCheck className="h-4 w-4" /> },
  ],
  warden: [
    { label: "Operations", to: "/warden", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Complaints", to: "/warden/complaints", icon: <Wrench className="h-4 w-4" /> },
    { label: "Leave Queue", to: "/warden/leave", icon: <CalendarDays className="h-4 w-4" /> },
    { label: "Rooms", to: "/warden/rooms", icon: <BedDouble className="h-4 w-4" /> },
    { label: "Gate & AI", to: "/warden/gate", icon: <ShieldCheck className="h-4 w-4" /> },
  ],
  admin: [
    { label: "Control", to: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Analytics", to: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Occupancy", to: "/admin/occupancy", icon: <BedDouble className="h-4 w-4" /> },
    { label: "Alerts", to: "/admin/alerts", icon: <BellRing className="h-4 w-4" /> },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  student: "Student Portal",
  guest: "Visitor Portal",
  warden: "Warden Operations",
  admin: "Admin Control",
};

export function PortalShell({
  role, title, eyebrow, actions, children,
}: {
  role: Role; title: string; eyebrow?: string; actions?: ReactNode; children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV[role];

  return (
    <div className="min-h-screen">
      <div className="ledger-grid pointer-events-none fixed inset-0 opacity-[0.18]" />
      <div className="relative grid min-h-screen md:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className={cn(
          "z-30 border-r border-border bg-sidebar/95 backdrop-blur md:sticky md:top-0 md:h-screen",
          open ? "fixed inset-y-0 left-0 w-72" : "hidden md:block",
        )}>
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-amber text-amber-foreground">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-base">Bunkhaus</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Hostel OS</div>
              </div>
            </Link>
            <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-3 py-4">
            <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {ROLE_LABEL[role]}
            </div>
            <nav className="flex flex-col gap-0.5">
              {items.map((it) => {
                const active = pathname === it.to;
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-amber/15 text-amber"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <span className={cn("transition-colors", active ? "text-amber" : "text-muted-foreground group-hover:text-foreground")}>
                      {it.icon}
                    </span>
                    {it.label}
                    {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber" /> : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
            <Link to="/login" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" /> Switch role
            </Link>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-20 bg-background/60 md:hidden" onClick={() => setOpen(false)} />}

        {/* Main */}
        <main className="relative min-w-0">
          <header className="sticky top-0 z-10 border-b border-border bg-background/70 backdrop-blur">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  {eyebrow ? (
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">{eyebrow}</div>
                  ) : null}
                  <h1 className="truncate font-display text-2xl leading-tight sm:text-3xl">{title}</h1>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            </div>
          </header>

          <div className="px-5 py-6 sm:px-8 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
