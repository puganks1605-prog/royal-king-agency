import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — Royal King Insurance" }, { name: "robots", content: "noindex" }],
  }),
  component: ResetPage,
});

function ResetPage() {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = new FormData(e.currentTarget).get("password") as string;
    if (!password || password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Password updated"); navigate({ to: "/portal" }); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-muted px-4">
      <Card className="w-full max-w-md p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password you don't use elsewhere.</p>
        <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="pwd">New password</Label>
            <Input id="pwd" name="password" type="password" required minLength={6} />
          </div>
          <Button type="submit" size="lg" disabled={busy}>{busy ? "Updating..." : "Update password"}</Button>
        </form>
      </Card>
    </div>
  );
}
