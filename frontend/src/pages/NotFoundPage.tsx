import { EmptyState } from "../components/common/EmptyState";
import { usePageTitle } from "../lib/hooks/usePageTitle";
import { EMPTY_MESSAGES } from "../lib/uiMessages";

export const NotFoundPage = ({
  message = EMPTY_MESSAGES.notFoundPage,
}: {
  message?: string;
}): React.JSX.Element => {
  usePageTitle("Nicht gefunden | ContentBlock");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-6 text-4xl font-semibold tracking-tight">
        Nicht gefunden
      </h1>
      <EmptyState message={message} />
    </section>
  );
};
