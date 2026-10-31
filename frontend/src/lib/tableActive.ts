export type ActiveEntry = Readonly<{
  /** Value of the first column; empty when the active cell is that column. */
  label: string;
  heading: string;
  value: string;
}>;

type ActiveSourceRow = Readonly<{
  values: readonly string[];
  active: readonly boolean[];
}>;

/** Lists every active cell of all rows, in table order (first column labels the row). */
export const collectActiveEntries = (
  headers: readonly string[],
  rows: readonly ActiveSourceRow[],
): ActiveEntry[] =>
  rows.flatMap((row) =>
    headers.flatMap((heading, index) =>
      row.active[index]
        ? [
            {
              label: index === 0 ? "" : (row.values[0] ?? "").trim(),
              heading,
              value: (row.values[index] ?? "").trim(),
            },
          ]
        : [],
    ),
  );
