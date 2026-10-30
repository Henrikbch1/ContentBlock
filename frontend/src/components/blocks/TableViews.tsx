import { cardClassName } from "../common/cardClassName";

export type TableDisplayRow = Readonly<{
  key: string;
  values: string[];
}>;

type TableViewsProps = Readonly<{
  headers: string[];
  id: string;
  label: string;
  rows: TableDisplayRow[];
}>;

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
        <thead className="bg-primary text-primary-foreground">
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
              {headers.map((heading, index) =>
                index === 0 ? (
                  <th
                    className="px-5 py-4 font-semibold text-foreground [overflow-wrap:anywhere]"
                    key={`${heading}:${index}`}
                    scope="row"
                  >
                    {row.values[index] ?? ""}
                  </th>
                ) : (
                  <td
                    className="px-5 py-4 text-foreground [overflow-wrap:anywhere]"
                    key={`${heading}:${index}`}
                  >
                    {row.values[index] ?? ""}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ol aria-label={`${label} als Karten`} className="grid gap-3 md:hidden">
      {rows.map((row) => (
        <li className={cardClassName("min-w-0 p-5")} key={row.key}>
          <dl className="flex flex-col gap-3">
            {headers.map((heading, index) => (
              <div
                className="flex min-w-0 flex-col gap-1"
                key={`${heading}:${index}`}
              >
                <dt className="text-base font-medium text-muted-foreground [overflow-wrap:anywhere]">
                  {heading}
                </dt>
                <dd className="min-w-0 text-base font-semibold [overflow-wrap:anywhere]">
                  {row.values[index] || "–"}
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
  </div>
);
