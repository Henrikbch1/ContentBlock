import { CircleHelp, Plus } from "lucide-react";
import type { BlockFaq } from "../../lib/types";
import { RichText } from "../common/RichText";
import { Section } from "../layout/Section";
import { EMPTY_MESSAGES } from "../../lib/uiMessages";

export const FaqBlock = ({ item }: { item: BlockFaq }): React.JSX.Element => (
  <Section containerClassName="max-w-3xl">
    {item.title && (
      <div className="mb-8 flex items-center gap-3">
        <CircleHelp aria-hidden="true" className="text-primary" size={24} />
        <h2 className="text-3xl font-semibold tracking-tight">{item.title}</h2>
      </div>
    )}
    {item.faqs?.length ? (
      <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-sm">
        {[...item.faqs]
          .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
          .map((faq, index) => (
            <details
              className="group border-b border-border last:border-b-0"
              key={faq.id ?? index}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left text-lg font-medium marker:hidden transition-colors hover:bg-muted/35 [&::-webkit-details-marker]:hidden">
                <span>{faq.question || "Frage"}</span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors group-open:border-primary group-open:bg-primary group-open:text-primary-foreground">
                  <Plus
                    aria-hidden="true"
                    className="transition-transform duration-200 group-open:rotate-45"
                    size={18}
                  />
                </span>
              </summary>
              <RichText
                content={faq.answer}
                className="px-5 pb-6 pr-16 leading-7 text-muted-foreground"
              />
            </details>
          ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">{EMPTY_MESSAGES.faq}</p>
    )}
  </Section>
);
