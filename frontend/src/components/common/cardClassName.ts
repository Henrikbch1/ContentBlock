import { cn } from "../../lib/utils";

const CARD_CLASS =
  "ctx-default rounded-card border border-border bg-card text-card-foreground shadow-card";

export const cardClassName = (...extra: Parameters<typeof cn>): string =>
  cn(CARD_CLASS, ...extra);
