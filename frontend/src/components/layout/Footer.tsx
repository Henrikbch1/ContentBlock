import type { DirectusRelation, Footer as FooterData, FooterLink, Page } from "../../lib/types";
import { Container } from "./Container";

type FooterProps = {
  footer?: DirectusRelation<FooterData>;
};

const getRelation = <T,>(relation: DirectusRelation<T> | undefined): T | null =>
  relation && typeof relation === "object" ? relation : null;

const getHref = (link: FooterLink): string | null => {
  if (link.external_url) {
    return link.external_url;
  }
  const page = getRelation(link.page as DirectusRelation<Page> | undefined);
  return page?.slug ? `/${page.slug}` : null;
};

const FooterLinkItem = ({ link }: { link: FooterLink }): React.JSX.Element | null => {
  const href = getHref(link);
  const label = link.label?.trim();
  if (!href || !label) {
    return null;
  }
  return (
    <li>
      <a className="text-sm text-muted-foreground transition-colors hover:text-foreground" href={href}>
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

  return (
    <footer className="border-t border-border bg-muted/30">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{footerData?.copyright || "ContentBlock"}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {requiredLinks.map((link) => {
              const page = getRelation(link.page);
              return page?.slug ? (
                <li key={link.label}>
                  <a className="text-sm font-medium text-foreground hover:opacity-65" href={`/${page.slug}`}>
                    {link.label}
                  </a>
                </li>
              ) : null;
            })}
          </ul>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(footerData?.columns ?? [])
            .slice()
            .sort((first, second) => (first.sort ?? 0) - (second.sort ?? 0))
            .map((link) => <FooterLinkItem key={String(link.id)} link={link} />)}
        </ul>
      </Container>
    </footer>
  );
};