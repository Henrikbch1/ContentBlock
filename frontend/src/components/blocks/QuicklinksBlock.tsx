import { ExternalLink } from "lucide-react";

import { getRelation } from "../../lib/directusRelations";
import type {
  BlockProps,
  BlockQuicklinks,
  QuicklinkItem,
} from "../../lib/types";
import { noticeClassName } from "../common/cardClassName";
import { SectionTitle } from "../common/SectionTitle";
import { SymbolIcon } from "../common/SymbolIcon";
import { Section } from "../layout/Section";

type QuicklinkTarget = Readonly<{ href: string; external: boolean }>;

const EXTERNAL_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

const getExternalHref = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    return EXTERNAL_PROTOCOLS.includes(new URL(trimmed).protocol)
      ? trimmed
      : null;
  } catch {
    return null;
  }
};

/** Interne Seite hat Vorrang vor der externen URL; ohne gültiges Ziel gibt es keinen Link. */
const getQuicklinkTarget = (item: QuicklinkItem): QuicklinkTarget | null => {
  const slug = getRelation(item.page)?.slug?.trim();
  if (slug) return { href: `/${slug}`, external: false };
  const href = getExternalHref(item.external_url);
  return href ? { href, external: href.startsWith("http") } : null;
};

const TABLET_COLUMNS = [
  "",
  "sm:grid-cols-1",
  "sm:grid-cols-2",
  "sm:grid-cols-3",
];
const DESKTOP_COLUMNS = [
  "",
  "lg:grid-cols-1",
  "lg:grid-cols-2",
  "lg:grid-cols-3",
  "lg:grid-cols-4",
  "lg:grid-cols-5",
];

/** Spaltenzahl je Anzahl, damit die letzte Reihe möglichst voll bleibt. */
const getColumns = (count: number): { tablet: number; desktop: number } => {
  if (count <= 3)
    return { tablet: Math.max(count, 1), desktop: Math.max(count, 1) };
  if (count === 4) return { tablet: 2, desktop: 4 };
  if (count === 5 || count === 10) return { tablet: 3, desktop: 5 };
  return { tablet: 3, desktop: count % 4 === 0 || count === 7 ? 4 : 3 };
};

const gridClassName = (count: number): string => {
  const { tablet, desktop } = getColumns(count);
  return [
    "grid list-none gap-4 p-0 sm:gap-6 lg:gap-8",
    count === 1
      ? "max-w-xs grid-cols-1"
      : "grid-cols-1 min-[24rem]:grid-cols-2",
    TABLET_COLUMNS[tablet],
    DESKTOP_COLUMNS[desktop],
  ].join(" ");
};

export const QuicklinksBlock = ({
  item,
  background,
}: BlockProps<BlockQuicklinks>): React.JSX.Element | null => {
  const links = [...(item.items ?? [])]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .flatMap((link) => {
      const label = link.label?.trim();
      const target = getQuicklinkTarget(link);
      return label && target ? [{ link, label, target }] : [];
    });
  if (!links.length) return null;

  return (
    <Section background={background}>
      {item.title && <SectionTitle>{item.title}</SectionTitle>}
      <ul className={gridClassName(links.length)}>
        {links.map(({ link, label, target }, index) => (
          <li className="flex" key={link.id ?? index}>
            <a
              className={noticeClassName(
                "group flex min-h-28 w-full flex-col items-start gap-2 px-4 pb-4 text-foreground no-underline transition-colors hover:bg-muted motion-reduce:transition-none",
              )}
              href={target.href}
              rel={target.external ? "noreferrer" : undefined}
              target={target.external ? "_blank" : undefined}
            >
              <SymbolIcon className="text-link" name={link.icon} size={28} />
              <span className="text-xl font-bold leading-snug underline-offset-4 [overflow-wrap:anywhere] group-hover:underline">
                {label}
                {target.external && (
                  <>
                    <ExternalLink
                      aria-hidden="true"
                      className="ml-1.5 inline align-[-0.125em]"
                      size="0.9em"
                    />
                    <span className="sr-only"> (öffnet in neuem Tab)</span>
                  </>
                )}
              </span>
              {link.text && (
                <span className="text-base text-muted-foreground [overflow-wrap:anywhere]">
                  {link.text}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
};
