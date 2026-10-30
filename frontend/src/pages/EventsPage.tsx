import { MapPin } from "lucide-react";
import { BackLink } from "../components/common/BackLink";
import { EmptyState } from "../components/common/EmptyState";
import { EventNotice } from "../components/common/EventNotice";
import { noticeGridClassName } from "../components/common/noticeGrid";
import { LoadingState } from "../components/common/LoadingState";
import { NoticeMeta } from "../components/common/NoticeMeta";
import { PageHeader } from "../components/common/PageHeader";
import { RichText } from "../components/common/RichText";
import { Section } from "../components/layout/Section";
import { useAsyncResource } from "../lib/hooks/useAsyncResource";
import { usePageTitle } from "../lib/hooks/usePageTitle";
import { getEventBySlug, getEvents } from "../lib/queries";
import { formatDateRange } from "../lib/format";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  UI_LABELS,
} from "../lib/uiMessages";
import { NotFoundPage } from "./NotFoundPage";

type EventsPageProps = {
  slug?: string;
};

const EventsOverview = (): React.JSX.Element => {
  const { data: events, isLoading, hasError } = useAsyncResource(getEvents, []);
  const eventList = events ?? [];

  usePageTitle("Termine | ContentBlock");

  return (
    <Section>
      <PageHeader
        title="Termine"
        intro="Kommende Termine und Veranstaltungen im Überblick."
      />
      {isLoading && <LoadingState message={LOADING_MESSAGES.eventsPage} />}
      {!isLoading && hasError && (
        <EmptyState message={ERROR_MESSAGES.eventsPage} />
      )}
      {!isLoading && !hasError && eventList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.eventsPage} />
      )}
      {!isLoading && !hasError && eventList.length > 0 && (
        <div className={noticeGridClassName(eventList.length)}>
          {eventList.map((event) => (
            <EventNotice event={event} headingLevel="h2" key={event.id} />
          ))}
        </div>
      )}
    </Section>
  );
};

const EventDetail = ({ slug }: { slug: string }): React.JSX.Element => {
  const {
    data: event,
    isLoading,
    hasError,
  } = useAsyncResource(() => getEventBySlug(slug), [slug]);

  usePageTitle(
    event?.title ? `${event.title} | Termine` : "Termine | ContentBlock",
  );

  if (isLoading)
    return <LoadingState centered message={LOADING_MESSAGES.eventDetail} />;
  if (hasError) return <EmptyState message={ERROR_MESSAGES.eventDetail} />;
  if (!event) return <NotFoundPage message={EMPTY_MESSAGES.eventNotFound} />;

  return (
    <Section containerClassName="max-w-3xl">
      <article>
        <BackLink href="/termine" label="Alle Termine" />
        <NoticeMeta
          label={UI_LABELS.event}
          value={formatDateRange(event.start_date, event.end_date) || null}
        />
        <h1 className="text-[2.25rem] leading-tight [overflow-wrap:anywhere] sm:text-[2.75rem]">
          {event.title ?? EMPTY_MESSAGES.untitled}
        </h1>
        {event.location && (
          <p className="mt-4 flex items-start gap-2 text-lg text-muted-foreground">
            <MapPin aria-hidden="true" className="mt-1.5 shrink-0" size={20} />
            <span className="[overflow-wrap:anywhere]">{event.location}</span>
          </p>
        )}
        <RichText content={event.description} className="prose-lg mt-8" />
      </article>
    </Section>
  );
};

export const EventsPage = ({ slug }: EventsPageProps): React.JSX.Element =>
  slug ? <EventDetail slug={slug} /> : <EventsOverview />;
