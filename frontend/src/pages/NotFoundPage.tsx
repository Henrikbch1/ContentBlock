import { EmptyState } from "../components/common/EmptyState";
import { Section } from "../components/layout/Section";
import { usePageTitle } from "../lib/hooks/usePageTitle";
import { EMPTY_MESSAGES } from "../lib/uiMessages";

export const NotFoundPage = ({
  message = EMPTY_MESSAGES.notFoundPage,
}: {
  message?: string;
}): React.JSX.Element => {
  usePageTitle("Nicht gefunden | ContentBlock");

  return (
    <Section containerClassName="max-w-3xl">
      <h1 className="mb-6 text-4xl font-semibold tracking-tight">
        Nicht gefunden
      </h1>
      <EmptyState message={message} />
    </Section>
  );
};
