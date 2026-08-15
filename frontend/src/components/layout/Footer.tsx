import type {
  DirectusRelation,
  Footer as FooterData,
  FooterLink,
  Page,
} from "../../lib/types";
import { Container } from "./Container";

type FooterProps = {
  footer?: DirectusRelation<FooterData>;
};

const getRelation = <T,>(
  relation: DirectusRelation<T> | undefined,
): T | null => (relation && typeof relation === "object" ? relation : null);

const getHref = (link: FooterLink): string | null => {
  if (link.external_url) {
    return link.external_url;
  }
  const page = getRelation(link.page as DirectusRelation<Page> | undefined);
  return page?.slug ? `/${page.slug}` : null;
};

const FooterLinkItem = ({
  link,
}: {
  link: FooterLink;
}): React.JSX.Element | null => {
  const href = getHref(link);
  const label = link.label?.trim();
  if (!href || !label) {
    return null;
  }
  return (
    <li>
      <a
        className="text-sm text-white/75 transition-colors hover:text-white"
        href={href}
      >
        {label}
      </a>
    </li>
  );
};

export const Footer = ({ footer }: FooterProps): React.JSX.Element => {
  const footerData = getRelation(footer);
  const requiredLinks = [
    { label: "Impressum", page: footerData?.imprint_page },
    { label: "Datenschutz", page: footerData?.privacy_page },
  ];

  const links = (footerData?.columns ?? [])
    .slice()
    .sort((first, second) => (first.sort ?? 0) - (second.sort ?? 0));
  return (
    <footer className="border-t-4 border-primary bg-[#17312e] text-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <section>
          <h2 className="font-heading text-2xl font-semibold">Kontakt</h2>
          <p className="mt-4 text-sm leading-6 text-white/75">
            {footerData?.copyright || "ContentBlock"}
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-semibold">
            Schnellzugriff
          </h2>
          <ul className="mt-4 space-y-3">
            {links.map((link) => (
              <FooterLinkItem key={String(link.id)} link={link} />
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-semibold">Rechtliches</h2>
          <ul className="mt-4 space-y-3">
            {requiredLinks.map((link) => {
              const page = getRelation(link.page);
              return page?.slug ? (
                <li key={link.label}>
                  <a
                    className="text-sm text-white/75 transition-colors hover:text-white"
                    href={`/${page.slug}`}
                  >
                    {link.label}
                  </a>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      </Container>
    </footer>
  );
};
