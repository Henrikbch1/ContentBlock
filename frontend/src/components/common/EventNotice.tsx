import { MapPin } from "lucide-react";

import { getRelation } from "../../lib/directusRelations";
import { formatDateRange } from "../../lib/format";
import { EMPTY_MESSAGES, UI_LABELS } from "../../lib/uiMessages";
import type { Event } from "../../lib/types";
import { noticeClassName } from "./cardClassName";
import { NoticeMeta } from "./NoticeMeta";
import { RichText } from "./RichText";

type EventNoticeProps = Readonly<{
  event: Event;
  headingLevel?: "h2" | "h3";
}>;

export const EventNotice = ({
  event,
  headingLevel: Heading = "h3",
}: EventNoticeProps): React.JSX.Element => (
  <a
    className={noticeClassName(
      "group flex flex-col text-foreground no-underline",
    )}
    href={`/termine/${event.slug ?? event.id}`}
  >
    <NoticeMeta
      label={getRelation(event.category)?.name?.trim() || UI_LABELS.event}
      value={formatDateRange(event.start_date, event.end_date)}
    />
    <Heading className="text-[1.375rem] leading-tight [overflow-wrap:anywhere]">
      {event.title ?? EMPTY_MESSAGES.untitled}
    </Heading>
    {event.location && (
      <p className="mt-3 flex items-start gap-2 text-muted-foreground">
        <MapPin aria-hidden="true" className="mt-1 shrink-0" size={18} />
        <span className="[overflow-wrap:anywhere]">{event.location}</span>
      </p>
    )}
    {event.description && (
      <RichText
        content={event.description}
        className="mt-3 line-clamp-3 text-base leading-7 text-muted-foreground [&_p]:m-0"
      />
    )}
    <span className="mt-auto pt-6 font-bold text-link underline decoration-2 underline-offset-4 group-hover:decoration-4">
      {UI_LABELS.viewEvent}
    </span>
  </a>
);
