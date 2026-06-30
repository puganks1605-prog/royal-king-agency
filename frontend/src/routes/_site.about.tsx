import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, Target, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About Royal King Insurance Agencies — Thoothukudi" },
      { name: "description", content: "Independent insurance consultancy in Thoothukudi led by N. Ebenezer Eby and E. Priscillal Grace. Trusted partner for individuals, families and businesses." },
      { property: "og:title", content: "About — Royal King Insurance Agencies" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-rk py-16 md:py-20">
          <span className="eyebrow text-white/80">About Us</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            A consultancy that earns trust the slow way — one customer at a time.
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Royal King Insurance Agencies is committed to helping customers obtain the best insurance coverage through trusted insurance partners. With professional guidance and personalised support, we ensure peace of mind for individuals, families, and businesses.
          </p>
        </div>
      </section>

      <section className="container-rk grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {[
          { Icon: ShieldCheck, t: "Independent", d: "Tied to 15+ insurers, not one." },
          { Icon: Target, t: "Right-fit advice", d: "We match cover to your life-stage." },
          { Icon: Heart, t: "Family-first", d: "We treat your policy like our own." },
          { Icon: GraduationCap, t: "Qualified team", d: "B.Tech & B.Lit credentials." },
        ].map(({ Icon, t, d }) => (
          <Card key={t} className="p-6 shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </Card>
        ))}
      </section>

      <section className="section-soft py-16">
        <div className="container-rk">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Management Team</span>
            <h2 className="mt-3 text-3xl font-bold">Led by qualified, hands-on advisors</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { name: "N. Ebenezer Eby", cred: "B.Tech (Mechanical)", role: "Principal Advisor" },
              { name: "E. Priscillal Grace", cred: "B.Lit", role: "Customer Experience" },
            ].map((m) => (
              <Card key={m.name} className="p-8 text-center shadow-soft">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-3xl font-display font-bold text-primary-foreground">
                  {m.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{m.name}</h3>
                <p className="text-sm font-semibold text-primary">{m.role}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.cred}</p>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg"><Link to="/contact">Get in touch</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
