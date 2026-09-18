import { Section } from "../layout/Section";
import { EMPTY_MESSAGES } from "../../lib/uiMessages";
import { getTableRows, getTableCellText } from "../../lib/tableData";
import type { BlockTable } from "../../lib/types";

export const TableBlock = ({
  item,
}: {
  item: BlockTable;
}): React.JSX.Element => {
  const rows = getTableRows(item.data);
  const [headerRow, ...bodyRows] = rows;
  return (
    <Section>
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
                      {getTableCellText(cell.value)}
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
                        {getTableCellText(cell.value)}
                      </th>
                    ) : (
                      <td
                        className="px-5 py-4 font-semibold text-foreground"
                        key={cellIndex}
                      >
                        {getTableCellText(cell.value)}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{EMPTY_MESSAGES.table}</p>
      )}
    </Section>
  );
};
