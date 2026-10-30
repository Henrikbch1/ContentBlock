import type {
  BlockProps,
  BlockTicker,
  DirectusRelation,
  Page,
} from "../../lib/types";
import { THEME_MODE } from "../../lib/themeMode";
import { UI_LABELS } from "../../lib/uiMessages";
import { Container } from "../layout/Container";

const getPageHref = (
  page: DirectusRelation<Page> | undefined,
): string | null =>
  page && typeof page === "object" && page.slug ? `/${page.slug}` : null;

export const TickerBlock = ({
  item,
}: BlockProps<BlockTicker>): React.JSX.Element | null => {
  const messages = item.messages?.filter((message) => message.text) ?? [];
  if (!messages.length) return null;
  const style =
    THEME_MODE === "neutral"
      ? undefined
      : {
          backgroundColor: item.background_color || undefined,
          color: item.text_color || undefined,
        };
  return (
    <aside
      aria-label={UI_LABELS.notice}
      className="ctx-default border-b border-border bg-paper text-foreground"
      style={style}
    >
      <Container className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:gap-6">
        <p className="notice-label flex shrink-0 items-center gap-2 text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-3 rounded-full bg-pin shadow-[inset_0_-1px_0_rgb(0_0_0/0.25)]"
          />
          {UI_LABELS.notice}
        </p>
        <ul className="flex flex-col gap-1 text-[1.0625rem] font-bold">
          {messages.map((message, index) => {
            const href = getPageHref(message.link);
            return (
              <li key={message.id ?? index}>
                {href ? (
                  <a
                    className="text-current underline decoration-pin decoration-2 underline-offset-4 hover:decoration-foreground"
                    href={href}
                  >
                    {message.text}
                  </a>
                ) : (
                  message.text
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </aside>
  );
};
