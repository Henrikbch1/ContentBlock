import type { BlockTable } from "../../lib/types";

type TableRow = { cells?: Array<{ value?: unknown }> };

const getRows = (data: unknown): TableRow[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((row): row is TableRow => Boolean(row && typeof row === "object"));
};

export const TableBlock = ({ item }: { item: BlockTable }): React.JSX.Element => {
  const rows = getRows(item.data);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {item.title && <h2 className="mb-6 text-3xl font-semibold tracking-tight">{item.title}</h2>}
      {rows.length ? (
        <div className="overflow-x-auto border border-border">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <tbody className="divide-y divide-border">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>{row.cells?.map((cell, cellIndex) => <td className="whitespace-nowrap px-4 py-3" key={cellIndex}>{String(cell.value ?? "")}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-sm text-muted-foreground">Keine Tabellendaten vorhanden.</p>}
    </section>
  );
};
