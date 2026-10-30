/** Chooses notice grid columns so a short row fills the board instead of leaving gaps. */
export const noticeGridClassName = (count: number): string => {
  if (count <= 1) return "grid max-w-2xl gap-6";
  if (count === 2 || count === 4) return "grid gap-6 md:grid-cols-2 lg:gap-8";
  return "grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8";
};
