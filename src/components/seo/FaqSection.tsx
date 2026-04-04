import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/data/siteSeo";

interface FaqSectionProps {
  title: string;
  intro?: string;
  faqs: FaqItem[];
}

const FaqSection = ({ title, intro, faqs }: FaqSectionProps) => {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[30px] border border-border/70 bg-card p-6 shadow-[0_18px_40px_rgba(24,17,8,0.06)] md:p-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-primary">FAQ</p>
        <h2 className="mt-4 font-display text-3xl font-light md:text-4xl">{title}</h2>
        {intro ? <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{intro}</p> : null}
      </div>

      <Accordion type="single" collapsible className="mt-6">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`} className="border-border/70">
            <AccordionTrigger className="text-left font-body text-base font-semibold text-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-7 text-muted-foreground md:text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FaqSection;
