type NoticeMetaProps = Readonly<{
  label: string;
  value?: string | null;
}>;

export const NoticeMeta = ({
  label,
  value,
}: NoticeMetaProps): React.JSX.Element => (
  <p className="notice-label mb-4 flex items-baseline justify-between gap-3 border-b border-border pb-2.5 text-muted-foreground">
    <span>{label}</span>
    {value && <span className="text-right">{value}</span>}
  </p>
);
