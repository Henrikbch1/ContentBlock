const UMLAUTS: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };

/**
 * Builds a stable, readable fragment id from a heading, e.g. "Unser Vorstand" -> "unser-vorstand".
 * @returns The id, or null when the text has no letters or digits.
 */
export const toAnchorId = (text: string): string | null => {
  const id = text
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => UMLAUTS[char] ?? char)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return id || null;
};
