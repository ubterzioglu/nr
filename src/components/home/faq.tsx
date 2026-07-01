import { faq } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { MotionDiv } from "@/components/shared/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow="SSS"
          title="Sıkça Sorulan Sorular"
          description="NEXRISE hakkında merak edilenler."
        />

        <MotionDiv className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={item.question} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </MotionDiv>
      </Container>
    </section>
  );
}
