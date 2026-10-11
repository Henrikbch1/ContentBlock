import type {
  BlockProps,
  BlockTicker,
  BlockTickerMessage,
  DirectusRelation,
  Page,
} from "../../lib/types";
import { cn } from "../../lib/utils";
import {
  getSectionBackgroundClasses,
  resolveSectionBackground,
} from "../layout/Section";

const getPageHref = (
  page: DirectusRelation<Page> | undefined,
): string | null =>
  page && typeof page === "object" && page.slug ? `/${page.slug}` : null;

const TickerMessages = ({
  messages,
  suffix,
}: {
  messages: BlockTickerMessage[];
  suffix: string;
}): React.JSX.Element => (
  <>
    {messages.map((message, index) => {
      const href = getPageHref(message.link);
      const key = `${message.id ?? message.text}-${suffix}-${index}`;
      return (
        <li key={key}>
          {href ? (
            <a className="underline-offset-4 hover:underline" href={href}>
              {message.text}
            </a>
          ) : (
            message.text
          )}
        </li>
      );
    })}
  </>
);

export const TickerBlock = ({
  item,
  background,
}: BlockProps<BlockTicker>): React.JSX.Element | null => {
  const messages = item.messages?.filter((message) => message.text) ?? [];
  if (!messages.length) return null;
  const tone = resolveSectionBackground(background, "surface");
  const style = {
    backgroundColor: item.background_color || undefined,
    color: item.text_color || undefined,
  };
  const listClassName = "flex shrink-0 gap-12 pr-12";
  return (
    <div
      aria-label="Laufende Meldungen"
      className={cn(
        "ticker-container overflow-hidden border-y border-border motion-reduce:overflow-x-auto",
        getSectionBackgroundClasses(tone),
      )}
      data-background={tone}
      role="region"
      style={style}
    >
      <div className="ticker-track flex w-max whitespace-nowrap py-3 text-sm font-medium">
        <ul className={listClassName}>
          <TickerMessages messages={messages} suffix="a" />
        </ul>
        <ul
          aria-hidden="true"
          className={cn(listClassName, "ticker-duplicate")}
          inert
        >
          <TickerMessages messages={messages} suffix="b" />
        </ul>
      </div>
    </div>
  );
};
