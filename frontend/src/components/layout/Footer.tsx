import type { PropsWithChildren } from "react";
import { getRelation } from "../../lib/directusRelations";
import { UI_LABELS } from "../../lib/uiMessages";
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

const getHref = (link: FooterLink): string | null => {
  if (link.external_url) {
    return link.external_url;
  }
  const page = getRelation(link.page as DirectusRelation<Page> | undefined);
  return page?.slug ? `/${page.slug}` : null;
};

const FooterLinkItem = ({
  href,
  label,
}: {
  href: string;
  label: string;
}): React.JSX.Element => (
  <li>
    <a
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      href={href}
    >
      {label}
    </a>
  </li>
);

const FooterSection = ({
  heading,
  children,
}: PropsWithChildren<{ heading: string }>): React.JSX.Element => (
  <section>
    <h2 className="font-heading text-xl font-semibold">{heading}</h2>
    {children}
  </section>
);

export const Footer = ({ footer }: FooterProps): React.JSX.Element => {
  const footerData = getRelation(footer);
  const contactText = footerData?.contact_text?.trim();
  const copyright = footerData?.copyright?.trim() || UI_LABELS.defaultCopyright;

  const quickLinks = (footerData?.columns ?? [])
    .slice()
    .sort((first, second) => (first.sort ?? 0) - (second.sort ?? 0))
    .flatMap((link) => {
      const href = getHref(link);
      const label = link.label?.trim();
      return href && label ? [{ key: String(link.id), href, label }] : [];
    });

  const legalLinks = [
    {
      key: "imprint",
      slug: getRelation(footerData?.imprint_page)?.slug,
      label: footerData?.imprint_label?.trim() || UI_LABELS.imprint,
    },
    {
      key: "privacy",
      slug: getRelation(footerData?.privacy_page)?.slug,
      label: footerData?.privacy_label?.trim() || UI_LABELS.privacy,
    },
  ].filter((link) => link.slug);

  return (
    <footer
      className="border-t-4 border-primary bg-inverse text-inverse-foreground"
      data-background="inverse"
    >
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {contactText && (
          <FooterSection heading={UI_LABELS.footerContact}>
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {contactText}
            </p>
          </FooterSection>
        )}
        {quickLinks.length > 0 && (
          <FooterSection heading={UI_LABELS.footerQuickLinks}>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <FooterLinkItem
                  href={link.href}
                  key={link.key}
                  label={link.label}
                />
              ))}
            </ul>
          </FooterSection>
        )}
        {legalLinks.length > 0 && (
          <FooterSection
            heading={footerData?.legal_heading?.trim() || UI_LABELS.footerLegal}
          >
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <FooterLinkItem
                  href={`/${link.slug}`}
                  key={link.key}
                  label={link.label}
                />
              ))}
            </ul>
          </FooterSection>
        )}
      </Container>
      <div className="border-t border-border">
        <Container className="py-6">
          <p className="text-sm text-muted-foreground">{copyright}</p>
        </Container>
      </div>
    </footer>
  );
};
