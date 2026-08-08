import type { BlockFaq } from "../../lib/types";

export const FaqBlock = ({ item }: { item: BlockFaq }): React.JSX.Element => (
  <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
    {item.title && <h2 className="mb-8 text-3xl font-semibold tracking-tight">{item.title}</h2>}
    {item.faqs?.length ? <div className="divide-y divide-border border-y border-border">
      {[...item.faqs].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)).map((faq, index) => (
        <details className="group py-5" key={faq.id ?? index}>
          <summary className="cursor-pointer list-none pr-8 text-lg font-medium marker:hidden">{faq.question || "Frage"}</summary>
          <p className="pt-3 leading-7 text-muted-foreground">{faq.answer || ""}</p>
        </details>
      ))}
    </div> : <p className="text-sm text-muted-foreground">Keine Fragen vorhanden.</p>}
  </section>
);
