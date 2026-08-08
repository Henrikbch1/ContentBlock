import { useEffect, useState } from "react";

import { getEventsForBlock } from "../../lib/queries";
import type { BlockEvents, Event } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";

const formatDate = (date: string | null | undefined): string =>
  date ? new Date(date).toLocaleDateString("de-DE") : "";

export const EventsBlock = ({ item }: { item: BlockEvents }): React.JSX.Element => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async (): Promise<void> => {
      setIsLoading(true);
      setHasError(false);
      try {
        const loadedEvents = await getEventsForBlock(item);
        if (isMounted) setEvents(loadedEvents);
      } catch {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadEvents();
    return () => {
      isMounted = false;
    };
  }, [item]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {item.title && <h2 className="mb-6 text-3xl font-semibold tracking-tight">{item.title}</h2>}
      {isLoading && <p aria-live="polite" className="text-sm text-muted-foreground" role="status">Veranstaltungen werden geladen ...</p>}
      {!isLoading && hasError && <EmptyState message="Veranstaltungen konnten nicht geladen werden." />}
      {!isLoading && !hasError && events.length === 0 && <EmptyState message="Keine Veranstaltungen vorhanden." />}
      {!isLoading && !hasError && events.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article className="border border-border bg-card p-6" key={event.id}>
              <p className="text-sm text-muted-foreground">{formatDate(event.start_date)}</p>
              <h3 className="mt-2 text-xl font-semibold">{event.title ?? ""}</h3>
              {event.location && <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>}
              {event.description && <p className="mt-3 text-muted-foreground">{event.description}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
