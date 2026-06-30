import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, HeartPulse, ShieldCheck, Home, Flame, Anchor, FileCheck2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SERVICES } from "@/lib/site";

const ICONS: Record<string, typeof Car> = { Car, HeartPulse, ShieldCheck, Home, Flame, Anchor, FileCheck2 };

const HIGHLIGHTS: Record<string, string[]> = {
  motor: ["Third-party + comprehensive options", "Zero-depreciation add-ons", "Cashless network garages across TN", "Roadside assistance"],
  health: ["Family floater & individual plans", "Critical illness riders", "Cashless hospitalisation network", "Tax benefit under 80D"],
  life: ["Term insurance for income protection", "Endowment & money-back plans", "ULIPs for goal-based investing", "Pension & retirement plans"],
  claims: ["Claim registration support", "Document verification help", "Insurer follow-up assistance", "Faster settlement guidance"],
  home: ["Building + contents cover", "Fire, theft, burglary, flood", "Electronic appliance protection", "Tenant-friendly options"],
  fire: ["Standard fire & special perils", "Stock & inventory cover", "Loss of profit endorsement", "Industrial all-risk"],
  marine: ["Cargo (import/export/inland)", "Hull & machinery", "Specie & valuables in transit", "Open & specific policies"],
};

export const Route = createFileRoute("/_site/services")({
  head: () => ({
    meta: [
      { title: "Insurance Services in Thoothukudi — Royal King Insurance" },
      { name: "description", content: "Motor, health, life, home, fire and marine insurance with comparison across 15+ insurers. Independent advice in Thoothukudi." },
      { property: "og:title", content: "Insurance Services — Royal King Insurance" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-rk py-16 md:py-20">
          <span className="eyebrow text-white/80">Our Services</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            Insurance built around your real life — not a brochure.
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Six product categories, fifteen insurers, one independent advisor. Pick a category to see what's typically included and request a tailored quote.
          </p>
        </div>
      </section>

      <section className="container-rk grid gap-6 py-16 lg:grid-cols-2">
        {SERVICES.map((s) => {
          const Icon = ICONS[s.icon] ?? ShieldCheck;
          return (
            <Card key={s.slug} id={s.slug} className="p-6 md:p-8 shadow-soft">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-bold">{s.title}</h2>
                  <p className="mt-2 text-muted-foreground">{s.desc}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {(HIGHLIGHTS[s.slug] ?? []).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {h}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-5">
                    <Link to="/portal/quote">Request a quote <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </section>
    </>
  );
}
