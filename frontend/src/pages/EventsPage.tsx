import { useEffect, useState } from "react";
import { EmptyState } from "../components/common/EmptyState";
import { RichText } from "../components/common/RichText";
import { getEventBySlug, getEvents } from "../lib/queries";
import type { Event } from "../lib/types";
import { formatDateRange } from "./format";
import { NotFoundPage } from "./NotFoundPage";

type EventsPageProps = {
  slug?: string;
};

const EventsOverview = (): React.JSX.Element => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    document.title = "Events | ContentBlock";
    let isMounted = true;
    void getEvents()
      .then((loadedEvents) => {
        if (isMounted) setEvents(loadedEvents);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">Events</h1>
      {isLoading && <p aria-live="polite" className="text-sm text-muted-foreground" role="status">Events werden geladen ...</p>}
      {!isLoading && hasError && <EmptyState message="Events konnten nicht geladen werden." />}
      {!isLoading && !hasError && events.length === 0 && <EmptyState message="Keine Events vorhanden." />}
      {!isLoading && !hasError && events.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <a className="border border-border bg-card p-6 transition-colors hover:border-primary" href={`/events/${event.slug ?? event.id}`} key={event.id}>
              <p className="text-sm text-muted-foreground">{formatDateRange(event.start_date, event.end_date)}</p>
              <h2 className="mt-2 text-xl font-semibold">{event.title ?? "Ohne Titel"}</h2>
              {event.location && <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>}
              {event.description && <p className="mt-3 text-muted-foreground">{event.description}</p>}
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

const EventDetail = ({ slug }: { slug: string }): React.JSX.Element => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    void getEventBySlug(slug)
      .then((loadedEvent) => {
        if (isMounted) {
          setEvent(loadedEvent);
          document.title = loadedEvent?.title ? `${loadedEvent.title} | Events` : "Events | ContentBlock";
        }
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) return <p aria-live="polite" className="px-4 py-16 text-center text-sm text-muted-foreground" role="status">Event wird geladen ...</p>;
  if (hasError) return <EmptyState message="Das Event konnte nicht geladen werden." />;
  if (!event) return <NotFoundPage message="Das Event wurde nicht gefunden." />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm text-muted-foreground">{formatDateRange(event.start_date, event.end_date)}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{event.title ?? "Ohne Titel"}</h1>
      {event.location && <p className="mt-4 text-lg text-muted-foreground">{event.location}</p>}
      <RichText content={event.description} className="mt-8 leading-7" />
    </article>
  );
};

export const EventsPage = ({ slug }: EventsPageProps): React.JSX.Element =>
  slug ? <EventDetail slug={slug} /> : <EventsOverview />;
