import { Plus } from "lucide-react";
import type { BlockFaq, BlockProps } from "../../lib/types";
import { noticeClassName } from "../common/cardClassName";
import { RichText } from "../common/RichText";
import { SectionTitle } from "../common/SectionTitle";
import { Section } from "../layout/Section";
import { EMPTY_MESSAGES } from "../../lib/uiMessages";

export const FaqBlock = ({
  item,
  background,
}: BlockProps<BlockFaq>): React.JSX.Element => (
  <Section background={background} containerClassName="max-w-[50rem]">
    {item.title && <SectionTitle>{item.title}</SectionTitle>}
    {item.faqs?.length ? (
      <div className={noticeClassName("px-0 pb-2 pt-8")}>
        {[...item.faqs]
          .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
          .map((faq, index) => (
            <details
              className="group border-t border-border"
              key={faq.id ?? index}
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 px-6 py-4 text-left text-lg font-bold marker:hidden transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden">
                <span className="[overflow-wrap:anywhere]">
                  {faq.question || "Frage"}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-current text-link transition-colors group-open:bg-primary group-open:text-primary-foreground">
                  <Plus
                    aria-hidden="true"
                    className="transition-transform duration-200 group-open:rotate-45"
                    size={20}
                  />
                </span>
              </summary>
              <RichText
                content={faq.answer}
                className="max-w-[68ch] px-6 pb-6 text-muted-foreground"
              />
            </details>
          ))}
      </div>
    ) : (
      <p className="text-base text-muted-foreground">{EMPTY_MESSAGES.faq}</p>
    )}
  </Section>
);
