type TableRow = { cells: Array<{ value: unknown }> };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const getTableRows = (data: unknown): TableRow[] => {
  if (!Array.isArray(data)) return [];
  const rows = data.filter(isRecord);
  const columnNumbers = rows.flatMap((row) =>
    Object.keys(row)
      .filter((key) => /^col_[1-9]\d*$/.test(key))
      .filter(
        (key) => row[key] !== null && row[key] !== undefined && row[key] !== "",
      )
      .map((key) => Number(key.slice(4))),
  );
  const columnCount = Math.max(0, ...columnNumbers);

  return rows.map((row) => {
    if (Array.isArray(row.cells)) {
      return {
        cells: row.cells.map((cell) => ({
          value: isRecord(cell) ? cell.value : null,
        })),
      };
    }
    return {
      cells: Array.from({ length: columnCount }, (_, index) => ({
        value: row[`col_${index + 1}`],
      })),
    };
  });
};

export const getTableCellText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  return JSON.stringify(value);
};
