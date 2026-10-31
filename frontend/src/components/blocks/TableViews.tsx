import { cardClassName } from "../common/cardClassName";
import { cn } from "../../lib/utils";
import { UI_LABELS } from "../../lib/uiMessages";

export type TableDisplayRow = Readonly<{
  key: string;
  values: string[];
  /** Per column: the cell holds a date range that includes today. */
  active: boolean[];
}>;

type TableViewsProps = Readonly<{
  headers: string[];
  id: string;
  label: string;
  rows: TableDisplayRow[];
}>;

const ACTIVE_CELL_CLASS = "bg-highlight text-highlight-foreground";

const ActiveMark = ({ heading }: { heading: string }): React.JSX.Element => (
  <>
    <span
      aria-hidden="true"
      className="mt-1 block w-fit rounded-card bg-primary px-2 py-0.5 text-sm font-semibold text-primary-foreground"
    >
      {UI_LABELS.tableActive}
    </span>
    <span className="sr-only">
      {heading}: {UI_LABELS.tableActive}
    </span>
  </>
);

export const TableViews = ({
  headers,
  id,
  label,
  rows,
}: TableViewsProps): React.JSX.Element => (
  <div id={id}>
    <div
      aria-label={`${label} als Tabelle`}
      className={cardClassName("hidden overflow-x-auto md:block")}
      role="region"
      tabIndex={0}
    >
      <table
        className="w-full table-fixed text-left text-base"
        style={{ minWidth: `${Math.max(38, headers.length * 12)}rem` }}
      >
        <caption className="sr-only">{label}</caption>
        <thead className="bg-rail text-rail-foreground">
          <tr>
            {headers.map((heading, index) => (
              <th
                className="px-5 py-4 font-semibold [overflow-wrap:anywhere]"
                key={`${heading}:${index}`}
                scope="col"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              className="transition-colors even:bg-muted/35 hover:bg-accent/45"
              key={row.key}
            >
              {headers.map((heading, index) => {
                const active = row.active[index];
                const content = (
                  <>
                    {row.values[index] ?? ""}
                    {active && <ActiveMark heading={heading} />}
                  </>
                );
                return index === 0 ? (
                  <th
                    className={cn(
                      "px-5 py-4 font-semibold text-foreground [overflow-wrap:anywhere]",
                      active && ACTIVE_CELL_CLASS,
                    )}
                    key={`${heading}:${index}`}
                    scope="row"
                  >
                    {content}
                  </th>
                ) : (
                  <td
                    className={cn(
                      "px-5 py-4 text-foreground [overflow-wrap:anywhere]",
                      active && ACTIVE_CELL_CLASS,
                    )}
                    key={`${heading}:${index}`}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ol aria-label={`${label} als Karten`} className="grid gap-3 md:hidden">
      {rows.map((row) => (
        <li
          className={cardClassName(
            "min-w-0 p-5",
            row.active.some(Boolean) && "border-s-4 border-s-pin",
          )}
          key={row.key}
        >
          <dl className="flex flex-col gap-3">
            {headers.map((heading, index) => (
              <div
                className="flex min-w-0 flex-col gap-1"
                key={`${heading}:${index}`}
              >
                <dt className="text-base font-medium text-muted-foreground [overflow-wrap:anywhere]">
                  {heading}
                </dt>
                <dd
                  className={cn(
                    "min-w-0 text-base font-semibold [overflow-wrap:anywhere]",
                    row.active[index] &&
                      cn(ACTIVE_CELL_CLASS, "-mx-2 rounded-card px-2 py-1"),
                  )}
                >
                  {row.values[index] || "–"}
                  {row.active[index] && <ActiveMark heading={heading} />}
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
  </div>
);
