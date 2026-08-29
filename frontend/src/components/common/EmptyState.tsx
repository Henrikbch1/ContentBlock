import { EMPTY_MESSAGES } from "../../lib/uiMessages";

type EmptyStateProps = {
  message?: string;
};

export const EmptyState = ({
  message = EMPTY_MESSAGES.content,
}: EmptyStateProps): React.JSX.Element => (
  <div
    aria-live="polite"
    className="border border-dashed border-border bg-muted/40 px-6 py-8 text-center text-sm text-muted-foreground"
    role="status"
  >
    {message}
  </div>
);
