import { sharpSAttribute } from "./displayTitle";

type PageHeaderProps = Readonly<{
  title: string;
  intro?: string;
}>;

export const PageHeader = ({
  title,
  intro,
}: PageHeaderProps): React.JSX.Element => (
  <header className="max-w-3xl [&:not(:last-child)]:mb-10">
    <h1
      className="display-title text-[2.75rem] leading-none [overflow-wrap:anywhere] sm:text-[4rem]"
      {...sharpSAttribute(title)}
    >
      {title}
    </h1>
    {intro && (
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{intro}</p>
    )}
  </header>
);
