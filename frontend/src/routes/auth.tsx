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
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

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
  const [showPwd, setShowPwd] = useState(false);

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
                  <div className="relative">
                    <Input id="si-pwd" name="password" type={showPwd ? "text" : "password"} required minLength={6} className="pr-10" />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPwd ? "Hide password" : "Show password"}>
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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
        </Card>
      </div>
    </div>
  );
}
