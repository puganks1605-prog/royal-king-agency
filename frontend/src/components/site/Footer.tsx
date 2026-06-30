import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";
import { SITE, SERVICES } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="container-rk grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo inverse />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            {SITE.tagline}. Authorised intermediary for India's leading insurers, serving Thoothukudi since inception.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-md bg-white/10 hover:bg-white/20">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/", "Home"], ["/services", "Services"], ["/about", "About Us"],
              ["/pollution-testing", "PUC Testing"], ["/blog", "Blog"],
              ["/faq", "FAQ"], ["/contact", "Contact"], ["/portal/quote", "Get a Quote"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-white/70 hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Insurance</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to="/services" className="text-white/70 hover:text-white">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Reach Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>{SITE.offices.main.address}</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0" />
              {SITE.phones.map((p, i) => (
                <span key={p}>{i > 0 && " · "}<a className="hover:text-white" href={`tel:+91${p.replace(/\s/g, "")}`}>+91 {p}</a></span>
              ))}
            </li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0" /><a className="hover:text-white" href={`mailto:${SITE.emails.main}`}>{SITE.emails.main}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-rk flex flex-col gap-2 py-5 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Royal King Insurance Agencies. All Rights Reserved.</span>
          <span className="italic">Reliable Insurance Solutions for a Secure Future.</span>
        </div>
      </div>
    </footer>
  );
}
