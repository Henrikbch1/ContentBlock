import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { useEffect } from "react";
import { EmptyState } from "../components/common/EmptyState";
import { RichText } from "../components/common/RichText";
import { useAsyncResource } from "../lib/hooks/useAsyncResource";
import { getEventBySlug, getEvents } from "../lib/queries";
import { formatDateRange } from "../lib/format";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../lib/uiMessages";
import { NotFoundPage } from "./NotFoundPage";

type EventsPageProps = {
  slug?: string;
};

const EventsOverview = (): React.JSX.Element => {
  const { data: events, isLoading, hasError } = useAsyncResource(getEvents, []);
  const eventList = events ?? [];

  useEffect(() => {
    document.title = "Termine | ContentBlock";
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          <CalendarDays aria-hidden="true" size={17} /> Vereinskalender
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Termine
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Arbeitsdienste, Versammlungen und alles, was gemeinsam stattfindet.
        </p>
      </header>
      {isLoading && (
        <p
          aria-live="polite"
          className="text-sm text-muted-foreground"
          role="status"
        >
          {LOADING_MESSAGES.eventsPage}
        </p>
      )}
      {!isLoading && hasError && (
        <EmptyState message={ERROR_MESSAGES.eventsPage} />
      )}
      {!isLoading && !hasError && eventList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.eventsPage} />
      )}
      {!isLoading && !hasError && eventList.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {eventList.map((event) => (
            <a
              className="group flex min-h-56 flex-col border border-border bg-card p-6 transition-colors hover:border-primary"
              href={`/termine/${event.slug ?? event.id}`}
              key={event.id}
            >
              <p className="text-sm font-medium text-primary">
                {formatDateRange(event.start_date, event.end_date)}
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight group-hover:text-primary">
                {event.title ?? "Ohne Titel"}
              </h2>
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
                Details ansehen <ArrowUpRight aria-hidden="true" size={16} />
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

const EventDetail = ({ slug }: { slug: string }): React.JSX.Element => {
  const {
    data: event,
    isLoading,
    hasError,
  } = useAsyncResource(() => getEventBySlug(slug), [slug]);

  useEffect(() => {
    document.title = event?.title
      ? `${event.title} | Termine`
      : "Termine | ContentBlock";
  }, [event]);

  if (isLoading)
    return (
      <p
        aria-live="polite"
        className="px-4 py-16 text-center text-sm text-muted-foreground"
        role="status"
      >
        {LOADING_MESSAGES.eventDetail}
      </p>
    );
  if (hasError) return <EmptyState message={ERROR_MESSAGES.eventDetail} />;
  if (!event) return <NotFoundPage message={EMPTY_MESSAGES.eventNotFound} />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <a
        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        href="/termine"
      >
        <ArrowLeft aria-hidden="true" size={16} /> Alle Termine
      </a>
      <p className="text-sm text-muted-foreground">
        {formatDateRange(event.start_date, event.end_date)}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        {event.title ?? "Ohne Titel"}
      </h1>
      {event.location && (
        <p className="mt-4 text-lg text-muted-foreground">{event.location}</p>
      )}
      <RichText content={event.description} className="mt-8 leading-7" />
    </article>
  );
};

export const EventsPage = ({ slug }: EventsPageProps): React.JSX.Element =>
  slug ? <EventDetail slug={slug} /> : <EventsOverview />;
