import { ArrowLeft } from "lucide-react";

type BackLinkProps = Readonly<{
  href: string;
  label: string;
}>;

export const BackLink = ({ href, label }: BackLinkProps): React.JSX.Element => (
  <a
    className="mb-8 inline-flex min-h-11 items-center gap-2 text-base font-bold text-link underline decoration-2 underline-offset-4 hover:decoration-4"
    href={href}
  >
    <ArrowLeft aria-hidden="true" size={16} /> {label}
  </a>
);
