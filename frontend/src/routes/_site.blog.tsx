import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_site/blog")({
  head: () => ({
    meta: [
      { title: "Insurance Blog — Royal King Insurance Thoothukudi" },
      { name: "description", content: "Plain-English guides to motor, health and life insurance from the team at Royal King Insurance Agencies, Thoothukudi." },
      { property: "og:title", content: "Insurance Blog — Royal King Insurance" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

const POSTS = [
  { title: "How to choose the right motor insurance policy", date: "Coming soon", excerpt: "Comprehensive vs third-party, add-ons that actually matter, and how to compare premiums fairly." },
  { title: "Health insurance for Thoothukudi families", date: "Coming soon", excerpt: "Floater vs individual, room rent capping, network hospitals and the tax angle." },
  { title: "What the PUC certificate really proves", date: "Coming soon", excerpt: "Why traffic police care, how often to test, and what fails a vehicle." },
];

function BlogPage() {
  return (
    <>
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-rk py-16">
          <span className="eyebrow text-white/80">Insurance Notes</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">Guides from our advisors</h1>
          <p className="mt-3 max-w-2xl text-white/80">Practical, India-specific guidance — written in everyday language.</p>
        </div>
      </section>
      <section className="container-rk grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <Card key={p.title} className="p-6 shadow-soft hover:shadow-elegant transition">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.date}</p>
            <h2 className="mt-2 font-display text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            <Link to="/contact" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Ask the advisor <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        ))}
      </section>
    </>
  );
}
