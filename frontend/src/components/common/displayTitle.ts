/** Marks display text whose sharp s must not be uppercased by CSS. */
export const sharpSAttribute = (text: string): { "data-sharp-s"?: true } =>
  text.includes("ß") ? { "data-sharp-s": true } : {};
