import {
  Clock,
  CalendarDays,
  Download,
  Euro,
  Fish,
  FileText,
  GraduationCap,
  House,
  IdCard,
  Images,
  Info,
  Leaf,
  Mail,
  Map,
  MapPin,
  Newspaper,
  Phone,
  Ruler,
  Sailboat,
  ScrollText,
  Ticket,
  Trophy,
  TriangleAlert,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";

/**
 * Feste Symbolliste, die das CMS (`nav_items.icon`, `block_quicklinks_items.icon`)
 * als Schlüssel anbietet. Explizite Einzel-Imports halten das Bundle klein.
 */
const ICONS = {
  start: House,
  fisch: Fish,
  gewaesser: Waves,
  boot: Sailboat,
  termine: CalendarDays,
  aktuelles: Newspaper,
  dokument: FileText,
  download: Download,
  ausweis: IdCard,
  gastkarte: Ticket,
  mitglieder: Users,
  jugend: GraduationCap,
  kontakt: Mail,
  telefon: Phone,
  info: Info,
  regeln: ScrollText,
  ort: MapPin,
  karte: Map,
  preis: Euro,
  galerie: Images,
  natur: Leaf,
  hinweis: TriangleAlert,
  zeit: Clock,
  masse: Ruler,
  erfolg: Trophy,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;

export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

const isIconKey = (key: string): key is IconKey =>
  Object.prototype.hasOwnProperty.call(ICONS, key);

/** Liefert die Icon-Komponente zum CMS-Schlüssel oder `null` bei leerem/unbekanntem Schlüssel. */
export const getIconComponent = (
  key: string | null | undefined,
): LucideIcon | null => {
  const normalized = key?.trim();
  return normalized && isIconKey(normalized) ? ICONS[normalized] : null;
};
