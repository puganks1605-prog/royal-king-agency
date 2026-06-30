import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/portal/profile")({
  head: () => ({ meta: [{ title: "My Profile — Royal King Insurance" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

const schema = z.object({
  full_name: z.string().trim().min(1).max(100),
  mobile: z.string().trim().min(7).max(20),
});

function ProfilePage() {
  const { user } = useAuth();
  const [full_name, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,mobile").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name ?? "");
      setMobile(data?.mobile ?? "");
    });
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p = schema.safeParse({ full_name, mobile });
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user!.id, full_name, mobile, email: user!.email });
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  }

  return (
    <Card className="max-w-xl p-6 md:p-8 shadow-soft">
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Keep your contact info up to date so we can reach you with quotes.</p>
      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} disabled />
        </div>
        <div>
          <Label htmlFor="fn">Full name</Label>
          <Input id="fn" value={full_name} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
        </div>
        <div>
          <Label htmlFor="mob">Mobile</Label>
          <Input id="mob" value={mobile} onChange={(e) => setMobile(e.target.value)} type="tel" required maxLength={20} />
        </div>
        <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save changes"}</Button>
      </form>
    </Card>
  );
}
