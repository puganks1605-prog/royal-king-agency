import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/lib/site";

export const Route = createFileRoute("/_site/faq")({
  head: () => ({
    meta: [
      { title: "Insurance FAQs — Royal King Insurance Thoothukudi" },
      { name: "description", content: "Answers to common questions about insurance, quotes, claims and PUC testing in Thoothukudi." },
      { property: "og:title", content: "FAQs — Royal King Insurance" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map(f => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-rk py-16">
          <span className="eyebrow text-white/80">FAQ</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">Quick answers, plainly written.</h1>
        </div>
      </section>
      <section className="container-rk py-16">
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`}>
              <AccordionTrigger className="text-left font-display text-base font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
