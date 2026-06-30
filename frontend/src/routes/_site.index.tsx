import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Award, BadgeCheck, Car, ShieldCheck, Sparkles, Star, HeartPulse, Home, Flame, Anchor, Phone, MessageCircle, Quote, Check, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImg from "@/assets/hero-family-advisor.png.asset.json";
import { SITE, SERVICES, PARTNERS, WHY_US, TESTIMONIALS } from "@/lib/site";

const ICONS: Record<string, typeof Car> = { Car, HeartPulse, ShieldCheck, Home, Flame, Anchor, FileCheck2 };

/** Shows partner logo image → falls back to branded initials badge if URL is empty or fails */
function PartnerLogo({ name, logo }: { name: string; logo: string; domain: string }) {
  const [failed, setFailed] = useState(!logo);

  if (failed) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={logo}
      alt={`${name} logo`}
      loading="lazy"
      decoding="async"
      width={96}
      height={32}
      className="h-8 w-auto max-w-[110px] object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Royal King Insurance Agencies — Insurance & PUC in Thoothukudi" },
      { name: "description", content: "Compare motor, health, life, home, fire and marine insurance from 15+ leading insurers. PUC vehicle pollution testing in Thoothukudi, Tamil Nadu." },
      { property: "og:title", content: "Royal King Insurance Agencies" },
      { property: "og:description", content: "Your Trusted Partner for Complete Insurance Solutions." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden hero-gradient text-white">
        <div className="container-rk grid gap-10 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="relative z-10">
            <span className="eyebrow text-white/80">
              <Sparkles className="h-3.5 w-3.5" /> Trusted in Thoothukudi · Since inception
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Protect what matters most with{" "}
              <span className="bg-gradient-to-r from-primary-glow to-white bg-clip-text text-transparent">
                Royal King Insurance Agencies
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
              We help individuals, families, and businesses compare and choose the best insurance plans from India's leading insurance companies.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-elegant">
                <Link to="/portal/quote">Get Free Quote <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link to="/auth">Customer Login</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-left">
              {[
                ["15+", "Top Insurers"],
                ["10k+", "Policies Served"],
                ["98%", "Claim Support"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
                  <dt className="font-display text-2xl font-bold text-white">{n}</dt>
                  <dd className="text-xs text-white/70">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-elegant">
              <img
                src={heroImg.url}
                alt="Insurance advisor consulting with a family in Thoothukudi"
                width={1600}
                height={1100}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <BadgeCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">IRDAI-licensed advisors</p>
                    <p className="text-xs text-white/70">Independent, transparent, customer-first.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-3 -top-3 hidden rounded-xl border border-white/15 bg-secondary px-3 py-2 text-xs font-semibold shadow-elegant md:block">
              ⭐ 4.9 / 5 from Thoothukudi customers
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container-rk py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow"><Award className="h-3.5 w-3.5" /> Our Services</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Insurance solutions for every need</h2>
          <p className="mt-3 text-muted-foreground">
            From your two-wheeler to your factory floor — we structure the right cover at the right premium.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon] ?? ShieldCheck;
            return (
              <Card key={s.slug} className="group relative overflow-hidden border-border/70 bg-card p-6 transition hover:-translate-y-1 hover:shadow-elegant">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-secondary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                    <Link to="/portal/quote" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                      {s.slug === "claims" ? "Get Claim Support" : "Request quote"} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition group-hover:scale-150" />
              </Card>
            );
          })}
        </div>
      </section>

      {/* WHY US */}
      <section className="section-soft py-20">
        <div className="container-rk grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <span className="eyebrow">Why choose us</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Independent advice you can build a future on.</h2>
            <p className="mt-4 text-muted-foreground">
              We are not tied to any single insurer. That means every recommendation is based on your real needs, not a sales target.
            </p>
            <Button asChild size="lg" className="mt-7">
              <Link to="/contact">Talk to an advisor <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {WHY_US.map((w) => (
              <li key={w.title} className="flex gap-3 rounded-xl border bg-card p-4 shadow-soft">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Check className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold">{w.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{w.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="container-rk py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Our partners</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{PARTNERS.length}+ leading insurance companies under one roof</h2>
          <p className="mt-3 text-muted-foreground">We compare and place policies with India's most trusted insurers.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="group flex h-24 flex-col items-center justify-center gap-2 rounded-xl border bg-card px-3 py-3 text-center transition hover:border-primary hover:shadow-soft"
            >
              <PartnerLogo name={p.name} logo={p.logo} domain={p.domain} />
              <span className="font-display text-xs font-semibold tracking-tight text-secondary group-hover:text-primary">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PUC BAND */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-rk grid gap-8 py-14 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <span className="eyebrow text-white/80">Pollution Testing Centre</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              PUC certificates issued on the spot, near Collector Office.
            </h2>
            <p className="mt-3 text-white/75 max-w-xl">
              Two-wheelers, cars and commercial vehicles. Walk in or book a time — we keep the queue moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" variant="secondary" className="bg-white text-secondary hover:bg-white/90">
              <Link to="/pollution-testing">View PUC Centre</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <a href={`tel:+91${SITE.pucPhones[0].replace(/\s/g, "")}`}>
                <Phone className="h-4 w-4" /> {SITE.pucPhones[0]}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-rk py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Customer Reviews</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Trusted by families and businesses in Thoothukudi</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="relative p-6 shadow-soft">
              <Quote className="absolute right-5 top-5 h-7 w-7 text-primary/20" />
              <div className="flex gap-0.5 text-warning">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-foreground/90">"{t.quote}"</p>
              <p className="mt-4 font-display text-sm font-bold">— {t.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-rk pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-10 text-primary-foreground shadow-elegant md:p-14">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 30%, white 0%, transparent 35%)" }} aria-hidden />
          <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready for a better policy at a better price?</h2>
              <p className="mt-3 max-w-2xl text-primary-foreground/85">
                Share a few details — we'll compare 15+ insurers and revert with the best option, usually within hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/portal/quote">Get Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
