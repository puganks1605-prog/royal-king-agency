import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Customer Login — Royal King Insurance" },
      { name: "description", content: "Sign in or create your Royal King Insurance customer account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Valid email required").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});
const signUpSchema = signInSchema.extend({
  full_name: z.string().trim().min(1).max(100),
  mobile: z.string().trim().min(7).max(20),
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: (search.redirect as "/portal") || "/portal", replace: true });
  }, [user, loading]);

  async function onSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const p = signInSchema.safeParse(fd);
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(p.data);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back!");
  }

  async function onSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const p = signUpSchema.safeParse(fd);
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: p.data.email,
      password: p.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
        data: { full_name: p.data.full_name, mobile: p.data.mobile },
      },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Account created. You're signed in.");
  }

  async function onGoogle() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/portal" });
    if (res.error) toast.error("Google sign-in failed");
  }

  async function onForgot() {
    const email = prompt("Enter your account email to receive a reset link:");
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message); else toast.success("Reset link sent.");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <aside className="hidden bg-secondary p-12 text-secondary-foreground lg:flex lg:flex-col lg:justify-between">
        <Logo inverse />
        <div>
          <ShieldCheck className="h-10 w-10 text-primary-glow" />
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight">
            Manage your policies and quotes in one secure place.
          </h2>
          <ul className="mt-6 space-y-2 text-sm text-white/80">
            <li>• Request and compare quotes from 15+ insurers</li>
            <li>• Track quotation status in real time</li>
            <li>• Download policies and PUC certificates</li>
            <li>• Renewal reminders so you never miss a date</li>
          </ul>
        </div>
        <p className="text-xs text-white/50">© 2026 Royal King Insurance Agencies</p>
      </aside>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-6 shadow-elegant md:p-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Logo />
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Home</Link>
          </div>
          <h1 className="font-display text-2xl font-bold">Customer Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in or create an account to manage your insurance.</p>

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-4">
              <form className="grid gap-3" onSubmit={onSignIn}>
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="si-pwd">Password</Label>
                  <Input id="si-pwd" name="password" type="password" required minLength={6} />
                </div>
                <button type="button" onClick={onForgot} className="self-end text-xs text-primary hover:underline">
                  Forgot password?
                </button>
                <Button type="submit" size="lg" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form className="grid gap-3" onSubmit={onSignUp}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="su-name">Full name</Label>
                    <Input id="su-name" name="full_name" required maxLength={100} />
                  </div>
                  <div>
                    <Label htmlFor="su-mob">Mobile</Label>
                    <Input id="su-mob" name="mobile" type="tel" required maxLength={20} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="su-pwd">Password</Label>
                  <Input id="su-pwd" name="password" type="password" required minLength={6} />
                </div>
                <Button type="submit" size="lg" disabled={busy}>{busy ? "Creating..." : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={onGoogle}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.45 2.1 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </Button>
        </Card>
      </div>
    </div>
  );
}
