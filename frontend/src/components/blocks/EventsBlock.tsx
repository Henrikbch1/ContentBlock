import { getEventsForBlock } from "../../lib/queries";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../../lib/uiMessages";
import type { BlockEvents, BlockProps } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";
import { EventNotice } from "../common/EventNotice";
import { noticeGridClassName } from "../common/noticeGrid";
import { LoadingState } from "../common/LoadingState";
import { SectionTitle } from "../common/SectionTitle";
import { Section } from "../layout/Section";

export const EventsBlock = ({
  item,
  background,
}: BlockProps<BlockEvents>): React.JSX.Element => {
  const {
    data: events,
    isLoading,
    hasError,
  } = useAsyncResource(() => getEventsForBlock(item), [item]);
  const eventList = events ?? [];

  return (
    <Section background={background}>
      {item.title && <SectionTitle>{item.title}</SectionTitle>}
      {isLoading && <LoadingState message={LOADING_MESSAGES.events} />}
      {!isLoading && hasError && <EmptyState message={ERROR_MESSAGES.events} />}
      {!isLoading && !hasError && eventList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.events} />
      )}
      {!isLoading && !hasError && eventList.length > 0 && (
        <div className={noticeGridClassName(eventList.length)}>
          {eventList.map((event) => (
            <EventNotice event={event} key={event.id} />
          ))}
        </div>
      )}
    </Section>
  );
};
