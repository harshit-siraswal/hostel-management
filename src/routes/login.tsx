import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Role } from "@/lib/hostel-data";
import { ArrowRight, Building2, ShieldCheck, Users, Briefcase, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthSession, saveAuthSession } from "@/lib/auth";
import { hasFirebaseConfig, signInWithFirebaseCredentials, signInWithGoogle } from "@/lib/firebase";

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

    const isDemoCredentials = email.trim().toLowerCase() === selectedDemo.toLowerCase() && password === "demo1234";

    try {
      if (isDemoCredentials) {
        clearAuthSession();
        saveAuthSession({
          provider: "demo",
          role,
          email: email.trim().toLowerCase(),
          token: `demo:${role}`,
        });
        setTimeout(() => navigate({ to: `/${role}` }), 450);
        return;
      }

      // If not demo credentials, must authenticate with Firebase
      if (!hasFirebaseConfig()) {
        throw new Error("Firebase configuration is missing. Real mode authentication is not available in this environment.");
      }

      await signInWithFirebaseCredentials(email.trim(), password, role);
      navigate({ to: `/${role}` });
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Unable to sign in right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!hasFirebaseConfig()) {
        throw new Error("Firebase configuration is missing. Google Sign-In is not available in this environment.");
      }
      await signInWithGoogle(role);
      navigate({ to: `/${role}` });
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Google Sign-In failed.";
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
            Select a portal and enter credentials to sign in.
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

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-muted-foreground">or</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card/50 hover:bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 disabled:opacity-60"
            >
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.6h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.77 21.56,11.41 21.35,11.1z" fill="#4285F4" />
                  <path d="M12,20.62c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.6c-0.91,0.61 -2.08,0.98 -3.3,0.98 -2.34,0 -4.33,-1.58 -5.04,-3.71H2.9v2.6C4.38,18.67 7.94,20.62 12,20.62z" fill="#34A853" />
                  <path d="M6.96,13.11c-0.18,-0.55 -0.28,-1.13 -0.28,-1.73s0.1,-1.18 0.28,-1.73V7.05H2.9C2.29,8.27 1.95,9.66 1.95,11.14s0.34,2.87 0.95,4.09l4.06,-3.12z" fill="#FBBC05" />
                  <path d="M12,4.88c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,2.2 14.42,1.38 12,1.38 7.94,1.38 4.38,3.33 2.9,6.33l4.06,3.12C7.67,6.46 9.66,4.88 12,4.88z" fill="#EA4335" />
                </g>
              </svg>
              Sign in with Google
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
