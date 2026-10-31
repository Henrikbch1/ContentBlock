import { UI_LABELS } from "../../lib/uiMessages";
import type { ActiveEntry } from "../../lib/tableActive";

type TableActiveSummaryProps = Readonly<{
  entries: readonly ActiveEntry[];
}>;

/** Static overview of all table cells that apply today, independent of paging. */
export const TableActiveSummary = ({
  entries,
}: TableActiveSummaryProps): React.JSX.Element | null =>
  entries.length === 0 ? null : (
    <div className="rounded-card bg-highlight px-5 py-4 text-base text-highlight-foreground">
      <p className="font-semibold">{UI_LABELS.tableActiveSummary}</p>
      <ul className="mt-2 flex list-none flex-col gap-1 p-0">
        {entries.map((entry, index) => (
          <li key={`${entry.label}:${entry.heading}:${index}`}>
            {entry.label && `${entry.label} – `}
            {entry.heading} {entry.value}
          </li>
        ))}
      </ul>
    </div>
  );
