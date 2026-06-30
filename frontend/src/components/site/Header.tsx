import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, User, LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/pollution-testing", label: "PUC Testing" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="hidden bg-secondary text-secondary-foreground md:block">
        <div className="container-rk flex h-9 items-center justify-between text-xs">
          <span className="opacity-80">{SITE.tagline}</span>
          <div className="flex items-center gap-4">
            <a href={`tel:+91${SITE.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:opacity-90">
              <Phone className="h-3.5 w-3.5" /> +91 {SITE.phones[0]}
            </a>
            <span className="opacity-50">|</span>
            <a href={`mailto:${SITE.emails.main}`} className="hover:opacity-90">{SITE.emails.main}</a>
          </div>
        </div>
      </div>
      <header
        className={`sticky top-0 z-40 w-full border-b transition-all ${
          scrolled ? "border-border bg-background/90 backdrop-blur-md shadow-soft" : "border-transparent bg-background"
        }`}
      >
        <div className="container-rk flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition ${
                    active ? "text-primary" : "text-foreground/80 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {n.label}
                  {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to={isAdmin ? "/admin" : "/portal"}>
                    <LayoutDashboard className="h-4 w-4" /> {isAdmin ? "Admin" : "Portal"}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">
                  <User className="h-4 w-4" /> Customer Login
                </Link>
              </Button>
            )}
            <Button asChild size="sm" className="shadow-elegant">
              <Link to="/portal/quote">Get Free Quote</Link>
            </Button>
          </div>
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="lg:hidden border-t bg-background">
            <div className="container-rk flex flex-col py-3">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-muted"
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t pt-3">
                {user ? (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link to={isAdmin ? "/admin" : "/portal"}>{isAdmin ? "Admin" : "Portal"}</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
                  </>
                ) : (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/auth">Customer Login</Link>
                  </Button>
                )}
                <Button asChild size="sm" className="col-span-2">
                  <Link to="/portal/quote">Get Free Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
