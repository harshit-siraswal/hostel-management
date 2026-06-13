import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Role } from "@/lib/hostel-data";
import { ArrowRight, Building2, ShieldCheck, Users, Briefcase, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthSession, saveAuthSession } from "@/lib/auth";
import { hasFirebaseConfig, signInWithFirebaseCredentials } from "@/lib/firebase";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Bunkhaus" }] }),
  component: LoginPage,
});

const ROLES: { id: Role; label: string; icon: any; demo: string }[] = [
  { id: "student", label: "Student", icon: GraduationCap, demo: "aarav@campus.edu" },
  { id: "guest",   label: "Visitor", icon: Users,         demo: "guest@bunkhaus" },
  { id: "warden",  label: "Warden",  icon: ShieldCheck,   demo: "warden.c@campus.edu" },
  { id: "admin",   label: "Admin",   icon: Briefcase,     demo: "admin@campus.edu" },
];

function LoginPage() {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedDemo = ROLES.find((r) => r.id === role)!.demo;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Enter an email and password, or use the demo credentials.");
      return;
    }
    setLoading(true);

    try {
      if (hasFirebaseConfig()) {
        await signInWithFirebaseCredentials(email, password, role);
        navigate({ to: `/${role}` });
        return;
      }

      clearAuthSession();
      saveAuthSession({
        provider: "demo",
        role,
        email,
        token: `demo:${role}`,
      });

      setTimeout(() => navigate({ to: `/${role}` }), 450);
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Unable to sign in right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const useDemo = () => {
    setEmail(selectedDemo);
    setPassword("demo1234");
  };

  return (
    <div className="relative min-h-screen">
      <div className="ledger-grid pointer-events-none fixed inset-0 opacity-[0.15]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-[1fr_1fr]">
        {/* Left brand panel */}
        <div className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-amber text-amber-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg">Bunkhaus</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Hostel OS</div>
            </div>
          </Link>

          <h1 className="mt-12 font-display text-5xl leading-[1.05] tracking-tight">
            One ledger. <br /> Four points of view.
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            Sign in to your role to enter a workspace tuned for what you actually
            do — whether that's checking your dues, approving leave, or watching
            occupancy climb across blocks.
          </p>

          <div className="mt-10 space-y-3">
            {[
              "Encrypted sessions · audit-trailed",
              "AI verification with manual override",
              "Works offline with cached ledgers",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-amber" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="glass-card rounded-2xl p-7 sm:p-10">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber">Sign in</div>
          <h2 className="mt-1 font-display text-3xl">Choose your portal</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Backend not wired? The prototype routes you straight to the dashboard.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ROLES.map((r) => {
              const active = role === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "group flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition",
                    active
                      ? "border-amber bg-amber/10 text-foreground"
                      : "border-border bg-card/50 hover:border-foreground/30",
                  )}
                >
                  <r.icon className={cn("h-4 w-4", active ? "text-amber" : "text-muted-foreground")} />
                  <div className="text-sm font-semibold">{r.label}</div>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Email" id="email">
              <input
                id="email" type="email" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedDemo}
                className="w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition focus:border-amber"
              />
            </Field>
            <Field label="Password" id="password" hint={
              <button type="button" onClick={useDemo} className="text-amber hover:underline">
                Use demo credentials
              </button>
            }>
              <input
                id="password" type="password" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition focus:border-amber"
              />
            </Field>

            {error ? (
              <div className="rounded-md border border-[color:var(--danger)]/40 bg-[color:var(--danger)]/10 px-3 py-2 text-sm text-[color:var(--danger)]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-3 text-sm font-semibold text-amber-foreground transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Signing in…" : <>Enter portal <ArrowRight className="h-4 w-4" /></>}
            </button>

            <div className="hairline pt-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">← Back to home</Link>
              <span className="font-mono">role · {role}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  id, label, hint, children,
}: { id: string; label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </label>
        {hint ? <div className="text-xs">{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}
