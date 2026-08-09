import type { BlockTable } from "../../lib/types";

type TableRow = { cells?: Array<{ value?: unknown }> };

const getRows = (data: unknown): TableRow[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((row): row is TableRow =>
    Boolean(row && typeof row === "object"),
  );
};

const getCellText = (value: unknown): string => {
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

export const TableBlock = ({
  item,
}: {
  item: BlockTable;
}): React.JSX.Element => {
  const rows = getRows(item.data);
  const [headerRow, ...bodyRows] = rows;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {item.title && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight">
          {item.title}
        </h2>
      )}
      {rows.length ? (
        <div className="overflow-x-auto rounded-(--radius) border border-border bg-card shadow-sm">
          <table className="min-w-152 w-full text-left text-sm">
            <caption className="sr-only">{item.title ?? "Tabelle"}</caption>
            {headerRow && (
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  {headerRow.cells?.map((cell, cellIndex) => (
                    <th
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em]"
                      key={cellIndex}
                      scope="col"
                    >
                      {getCellText(cell.value)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-border">
              {bodyRows.map((row, rowIndex) => (
                <tr
                  className="transition-colors even:bg-muted/35 hover:bg-accent/45"
                  key={rowIndex}
                >
                  {row.cells?.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th
                        className="px-5 py-4 font-semibold text-foreground"
                        key={cellIndex}
                        scope="row"
                      >
                        {getCellText(cell.value)}
                      </th>
                    ) : (
                      <td
                        className="px-5 py-4 font-semibold text-foreground"
                        key={cellIndex}
                      >
                        {getCellText(cell.value)}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Keine Tabellendaten vorhanden.
        </p>
      )}
    </section>
  );
};
