import { createFileRoute } from "@tanstack/react-router";
import { Check, Phone, Mail, MapPin, Clock, Bike, Car, Truck, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_site/pollution-testing")({
  head: () => ({
    meta: [
      { title: "Vehicle Pollution Testing Centre (PUC) — Thoothukudi" },
      { name: "description", content: "PUC certificates for two-wheelers, cars and commercial vehicles in Thoothukudi. Instant testing at Kalluri Nagar, near Collector Office." },
      { property: "og:title", content: "PUC Vehicle Pollution Testing — Thoothukudi" },
      { property: "og:url", content: "/pollution-testing" },
    ],
    links: [{ rel: "canonical", href: "/pollution-testing" }],
  }),
  component: PucPage,
});

const SERVICES = [
  { Icon: FileCheck, t: "Pollution Under Control (PUC) Certificate", d: "Government-approved certificates issued on the spot." },
  { Icon: Bike, t: "Two-Wheeler Emission Testing", d: "Quick test for bikes and scooters — back on the road in minutes." },
  { Icon: Car, t: "Car Emission Testing", d: "Petrol, diesel, CNG and LPG variants supported." },
  { Icon: Truck, t: "Commercial Vehicle Testing", d: "Goods carriers, autos, taxis, school vans and more." },
  { Icon: Clock, t: "Instant Certificate Generation", d: "Print and digital copy ready as you wait." },
  { Icon: Check, t: "Certificate Renewal Assistance", d: "Reminders and renewal — we'll keep you compliant." },
];

function PucPage() {
  return (
    <>
      <section className="hero-gradient text-white">
        <div className="container-rk py-16 md:py-20">
          <span className="eyebrow text-white/80">Pollution Testing Centre</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            PUC certificates — instant, compliant, no queue games.
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Authorised vehicle emission testing centre in Thoothukudi. Two-wheelers, cars and commercial vehicles — all tested on government-calibrated equipment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={`tel:+91${SITE.pucPhones[0].replace(/\s/g, "")}`}>
                <Phone className="h-4 w-4" /> Call {SITE.pucPhones[0]}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <a href={`https://wa.me/${SITE.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20PUC%20test.`} target="_blank" rel="noreferrer">WhatsApp us</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-rk grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ Icon, t, d }) => (
          <Card key={t} className="p-6 shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-base font-bold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </Card>
        ))}
      </section>

      <section className="section-soft py-16">
        <div className="container-rk grid gap-8 lg:grid-cols-2">
          <Card className="p-6 shadow-soft">
            <h2 className="font-display text-xl font-bold">PUC Centre Address</h2>
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {SITE.offices.puc.address}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              {SITE.pucPhones.map((p, idx) => (
                <span key={p}>{idx > 0 && " · "}<a className="hover:text-primary" href={`tel:+91${p.replace(/\s/g, "")}`}>+91 {p}</a></span>
              ))}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <a className="hover:text-primary" href={`mailto:${SITE.emails.puc}`}>{SITE.emails.puc}</a>
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" /> Mon–Sat · 9:00 AM – 8:00 PM
            </p>
          </Card>
          <Card className="overflow-hidden p-0 shadow-soft">
            <iframe
              title="PUC Centre location"
              src="https://www.google.com/maps?q=Kalluri+Nagar+Thoothukudi&output=embed"
              className="h-full min-h-64 w-full border-0"
              loading="lazy"
            />
          </Card>
        </div>
      </section>
    </>
  );
}
