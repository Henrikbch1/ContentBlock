type LoadingStateProps = Readonly<{
  message: string;
  centered?: boolean;
}>;

export const LoadingState = ({
  message,
  centered = false,
}: LoadingStateProps): React.JSX.Element => (
  <p
    aria-live="polite"
    className={
      centered
        ? "px-4 py-16 text-center text-sm text-muted-foreground"
        : "text-sm text-muted-foreground"
    }
    role="status"
  >
    {message}
  </p>
);
