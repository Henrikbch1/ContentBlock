import { useEffect, useId, useState } from "react";

import { Section } from "../layout/Section";
import { EMPTY_MESSAGES } from "../../lib/uiMessages";
import { getTableCellText, getTableRows } from "../../lib/tableData";
import type { TableRow } from "../../lib/tableData";
import type { BlockProps, BlockTable } from "../../lib/types";
import { TableViews } from "./TableViews";
import type { TableDisplayRow } from "./TableViews";

const TABLE_BREAKPOINT = "(min-width: 48rem)";
const DESKTOP_PAGE_SIZE = 20;
const MOBILE_PAGE_SIZE = 5;

const getPageSize = (wide: boolean): number =>
  wide ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE;

const identifyRows = (rows: TableRow[]): TableDisplayRow[] => {
  const occurrences = new Map<string, number>();
  return rows.map((row) => {
    const values = row.cells.map((cell) => getTableCellText(cell.value));
    const content = JSON.stringify(values);
    const occurrence = occurrences.get(content) ?? 0;
    occurrences.set(content, occurrence + 1);
    return { key: `${content}:${occurrence}`, values };
  });
};

export const TableBlock = ({
  item,
  background,
}: BlockProps<BlockTable>): React.JSX.Element => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() =>
    getPageSize(window.matchMedia(TABLE_BREAKPOINT).matches),
  );
  const searchId = useId();
  const tableId = useId();
  useEffect(() => {
    const media = window.matchMedia(TABLE_BREAKPOINT);
    const onChange = (event: MediaQueryListEvent): void =>
      setPageSize(getPageSize(event.matches));
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const [header, ...body] = getTableRows(item.data);
  const rows = identifyRows(body);
  const search = query.trim().toLocaleLowerCase();
  const filtered = search
    ? rows.filter((row) =>
        row.values.some((value) => value.toLocaleLowerCase().includes(search)),
      )
    : rows;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const offset = (currentPage - 1) * pageSize;
  const visibleRows = filtered.slice(offset, offset + pageSize);
  const columnCount = rows.reduce(
    (count, row) => Math.max(count, row.values.length),
    header?.cells.length ?? 0,
  );
  const headers = Array.from({ length: columnCount }, (_, index) => {
    const value = getTableCellText(header?.cells[index]?.value).trim();
    return value || `Spalte ${index + 1}`;
  });
  const label = item.title?.trim() || "Tabelle";

  return (
    <Section background={background}>
      {item.title && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight [overflow-wrap:anywhere]">
          {item.title}
        </h2>
      )}
      {!header ? (
        <p className="text-base text-muted-foreground">{EMPTY_MESSAGES.table}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {rows.length > 0 && (
            <div className="flex max-w-md flex-col gap-2">
              <label className="font-semibold" htmlFor={searchId}>
                Tabelle durchsuchen
              </label>
              <input
                aria-controls={tableId}
                className="min-h-11 rounded-card border border-input bg-background px-4 text-foreground"
                id={searchId}
                onChange={(event) => {
                  setQuery(event.currentTarget.value);
                  setPage(1);
                }}
                type="search"
                value={query}
              />
            </div>
          )}
          {filtered.length === 0 && rows.length > 0 && (
            <p role="status">{EMPTY_MESSAGES.tableNoResults}</p>
          )}
          <TableViews
            headers={headers}
            id={tableId}
            label={label}
            rows={visibleRows}
          />
          {filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p aria-live="polite" className="text-base text-muted-foreground">
                Zeilen {offset + 1}–{offset + visibleRows.length} von{" "}
                {filtered.length}
              </p>
              {pages > 1 && (
                <div className="flex gap-2">
                  <button
                    className="min-h-11 rounded-card border border-input px-4 font-semibold disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    type="button"
                  >
                    Zurück
                  </button>
                  <button
                    className="min-h-11 rounded-card border border-input px-4 font-semibold disabled:opacity-50"
                    disabled={currentPage === pages}
                    onClick={() => setPage(currentPage + 1)}
                    type="button"
                  >
                    Weiter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Section>
  );
};
