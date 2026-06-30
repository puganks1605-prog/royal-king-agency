import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { SERVICES } from "@/lib/site";

export const Route = createFileRoute("/_app/portal/quote")({
  head: () => ({ meta: [{ title: "Request a Quote — Royal King Insurance" }, { name: "robots", content: "noindex" }] }),
  component: QuotePage,
});

const schema = z.object({
  full_name: z.string().trim().min(1).max(100),
  mobile: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  insurance_type: z.string().min(1),
  vehicle_details: z.string().max(500).optional().or(z.literal("")),
  property_details: z.string().max(500).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

function QuotePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState<string>("Motor Insurance");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    fd.insurance_type = type;
    const p = schema.safeParse(fd);
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.from("quote_requests").insert({
      ...p.data,
      user_id: user!.id,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Request submitted! Our team will contact you shortly."); navigate({ to: "/portal/requests" }); }
  }

  const showVehicle = type === "Motor Insurance";
  const showProperty = type === "Home Insurance" || type === "Fire Insurance";

  return (
    <Card className="p-6 md:p-8 shadow-soft">
      <h1 className="font-display text-2xl font-bold">Request an insurance quote</h1>
      <p className="mt-1 text-sm text-muted-foreground">Free, no obligation. We'll compare 15+ insurers and revert within hours.</p>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" required defaultValue={user?.user_metadata?.full_name ?? ""} maxLength={100} />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input id="mobile" name="mobile" required type="tel" defaultValue={user?.user_metadata?.mobile ?? ""} maxLength={20} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required defaultValue={user?.email ?? ""} />
        </div>
        <div>
          <Label>Insurance type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => <SelectItem key={s.slug} value={s.title}>{s.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {showVehicle && (
          <div>
            <Label htmlFor="vehicle_details">Vehicle details</Label>
            <Textarea id="vehicle_details" name="vehicle_details" rows={3} placeholder="Make, model, year, registration number, current insurer (if any)" maxLength={500} />
          </div>
        )}
        {showProperty && (
          <div>
            <Label htmlFor="property_details">Property details</Label>
            <Textarea id="property_details" name="property_details" rows={3} placeholder="Type of property, location, approximate value" maxLength={500} />
          </div>
        )}
        <div>
          <Label htmlFor="notes">Additional notes (optional)</Label>
          <Textarea id="notes" name="notes" rows={3} maxLength={1000} />
        </div>
        <Button type="submit" size="lg" disabled={busy}>{busy ? "Submitting..." : "Submit request"}</Button>
      </form>
    </Card>
  );
}
