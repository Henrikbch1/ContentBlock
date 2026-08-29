export const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("de-DE");
};

export const formatDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return end && end !== start ? `${start} - ${end}` : start;
};
