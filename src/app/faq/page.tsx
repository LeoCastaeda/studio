import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/data";
import { HelpCircle } from "lucide-react";

export default function FaqPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground h-24 w-24 rounded-full mb-4">
                <span className="text-5xl font-bold">?</span>
            </div>
          <h1 className="text-4xl font-headline font-bold">Preguntas Frecuentes</h1>
          <p className="mt-2 text-muted-foreground">
            Encuentra respuestas a preguntas comunes sobre nuestros productos y servicios.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
