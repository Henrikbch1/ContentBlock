import { ArrowUpRight, MapPin } from "lucide-react";

import { getEventsForBlock } from "../../lib/queries";
import { formatDate } from "../../lib/format";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../../lib/uiMessages";
import type { BlockEvents } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";
import { LoadingState } from "../common/LoadingState";
import { RichText } from "../common/RichText";
import { Section } from "../layout/Section";

export const EventsBlock = ({
  item,
}: {
  item: BlockEvents;
}): React.JSX.Element => {
  const {
    data: events,
    isLoading,
    hasError,
  } = useAsyncResource(() => getEventsForBlock(item), [item]);
  const eventList = events ?? [];

  return (
    <Section>
      {item.title && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight">
          {item.title}
        </h2>
      )}
      {isLoading && <LoadingState message={LOADING_MESSAGES.events} />}
      {!isLoading && hasError && <EmptyState message={ERROR_MESSAGES.events} />}
      {!isLoading && !hasError && eventList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.events} />
      )}
      {!isLoading && !hasError && eventList.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {eventList.map((event) => (
            <a
              className="group flex min-h-64 flex-col border border-border bg-card p-6 transition-colors hover:border-primary"
              href={`/termine/${event.slug ?? event.id}`}
              key={event.id}
            >
              <p className="text-sm font-medium text-primary">
                {formatDate(event.start_date)}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-primary">
                {event.title ?? ""}
              </h3>
              {event.location && (
                <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin aria-hidden="true" size={16} />
                  {event.location}
                </p>
              )}
              {event.description && (
                <RichText
                  content={event.description}
                  className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground [&_p]:m-0"
                />
              )}
              <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-foreground">
                Termin ansehen <ArrowUpRight aria-hidden="true" size={16} />
              </span>
            </a>
          ))}
        </div>
      )}
    </Section>
  );
};
