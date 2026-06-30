import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact Royal King Insurance Agencies — Thoothukudi" },
      { name: "description", content: "Visit our main office near New Bus Stand or branch at Chidambara Nagar in Thoothukudi. Call, WhatsApp or email us." },
      { property: "og:title", content: "Contact — Royal King Insurance" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  mobile: z.string().trim().max(20).optional(),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

function ContactPage() {
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setBusy(false);
    if (error) toast.error("Could not send message. Please try again.");
    else {
      toast.success("Thanks! We'll get back to you shortly.");
      e.currentTarget.reset();
    }
  }

  return (
    <>
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-rk py-16 md:py-20">
          <span className="eyebrow text-white/80">Contact</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">We're a phone call or walk-in away.</h1>
          <p className="mt-4 max-w-2xl text-white/80">Two offices in Thoothukudi. Choose what's closer — both teams will look after you the same way.</p>
        </div>
      </section>

      <section className="container-rk grid gap-8 py-16 lg:grid-cols-[1.1fr_1fr]">
        <Card className="p-6 md:p-8 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">We typically respond within a few hours during business days.</p>
          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required maxLength={100} />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" name="mobile" type="tel" maxLength={20} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required maxLength={255} />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" maxLength={120} />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required maxLength={2000} rows={5} />
            </div>
            <Button type="submit" size="lg" disabled={busy}>
              <Send className="h-4 w-4" /> {busy ? "Sending..." : "Send message"}
            </Button>
          </form>
        </Card>

        <div className="space-y-5">
          {[SITE.offices.main, SITE.offices.branch].map((o, i) => (
            <Card key={o.label} className="p-6 shadow-soft">
              <h3 className="font-display text-lg font-bold">{o.label}</h3>
              <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {o.address}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {SITE.phones.map((p, idx) => (
                  <span key={p}>{idx > 0 && " · "}<a className="hover:text-primary" href={`tel:+91${p.replace(/\s/g, "")}`}>+91 {p}</a></span>
                ))}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a className="hover:text-primary" href={`mailto:${i === 0 ? SITE.emails.main : SITE.emails.branch}`}>
                  {i === 0 ? SITE.emails.main : SITE.emails.branch}
                </a>
              </p>
            </Card>
          ))}
          <Card className="overflow-hidden p-0 shadow-soft">
            <iframe
              title="Royal King Insurance location"
              src="https://www.google.com/maps?q=Tuticorin+New+Bus+Stand&output=embed"
              className="h-64 w-full border-0"
              loading="lazy"
            />
          </Card>
        </div>
      </section>
    </>
  );
}
