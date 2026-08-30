type PageHeaderProps = Readonly<{
  eyebrow: React.ReactNode;
  title: string;
  intro: string;
}>;

export const PageHeader = ({
  eyebrow,
  title,
  intro,
}: PageHeaderProps): React.JSX.Element => (
  <header className="mb-10 max-w-2xl">
    <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
      {eyebrow}
    </p>
    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
      {title}
    </h1>
    <p className="mt-4 text-lg leading-8 text-muted-foreground">{intro}</p>
  </header>
);
