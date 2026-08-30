import { ArrowLeft } from "lucide-react";

type BackLinkProps = Readonly<{
  href: string;
  label: string;
}>;

export const BackLink = ({ href, label }: BackLinkProps): React.JSX.Element => (
  <a
    className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
    href={href}
  >
    <ArrowLeft aria-hidden="true" size={16} /> {label}
  </a>
);
