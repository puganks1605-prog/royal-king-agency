import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ShieldAlert, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Admin Secure Login — Royal King Insurance" },
      { name: "description", content: "Secure admin portal entry for Royal King Insurance." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Valid email required").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

function AdminLoginPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/admin/login" });
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        navigate({ to: (search.redirect as "/admin") || "/admin", replace: true });
      } else {
        // Regular customers logged in shouldn't be here, send to portal
        navigate({ to: "/portal", replace: true });
      }
    }
  }, [user, loading, isAdmin]);

  async function onSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const p = signInSchema.safeParse(fd);
    if (!p.success) return toast.error(p.error.issues[0].message);
    
    setBusy(true);
    // Call the dedicated admin login endpoint
    const { data, error } = await supabase.auth.signInAdminWithPassword(p.data);
    setBusy(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Access Granted. Welcome, Administrator.");
    }
  }

  return (
    <div className="relative grid min-h-screen items-center justify-center bg-slate-950 p-6 font-sans text-slate-100 selection:bg-primary selection:text-white">
      {/* Dynamic background glow effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Logo inverse />
          <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white">
            <ArrowLeft className="h-3 w-3" /> Back to Site
          </Link>
        </div>

        <Card className="border-slate-800 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-white">Admin Secure Sign In</h1>
              <p className="mt-0.5 text-xs text-slate-400">Restricted access area. Authorized logs monitored.</p>
            </div>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={onSignIn}>
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Admin Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@royalking.com"
                required
                className="border-slate-800 bg-slate-950/80 text-white placeholder-slate-600 focus-visible:ring-red-500/40"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pwd" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Security Password
              </Label>
              <div className="relative">
                <Input
                  id="pwd"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="border-slate-800 bg-slate-950/80 pr-10 text-white placeholder-slate-600 focus-visible:ring-red-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="mt-2 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-lg transition-transform hover:scale-[1.01] hover:from-red-500 hover:to-red-600 active:scale-[0.99] disabled:opacity-50"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying Credentials...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" /> Secure Auth
                </span>
              )}
            </Button>
          </form>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-500">
          Unauthorized attempts are logged with IP & browser metadata.
        </p>
      </div>
    </div>
  );
}
