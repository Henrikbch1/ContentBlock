const DEFAULT_COLUMN_COUNT = 2;
const COLUMN_KEY = /^col_[1-9]\d*$/;

const isCellValue = (value) =>
  value === null || ["string", "number", "boolean"].includes(typeof value);

const isRow = (row) =>
  row !== null && typeof row === "object" && !Array.isArray(row) &&
  Object.entries(row).every(([key, value]) => COLUMN_KEY.test(key) && isCellValue(value));

export const columnKey = (index) => `col_${index + 1}`;

export const emptyRow = (columnCount) =>
  Object.fromEntries(Array.from({ length: columnCount }, (_, index) => [columnKey(index), ""]));

export function readTable(value) {
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    return { rows: [emptyRow(DEFAULT_COLUMN_COUNT)], columnCount: DEFAULT_COLUMN_COUNT };
  }
  if (!Array.isArray(value) || !value.every(isRow)) {
    throw new Error("Unsupported table data. Existing content has not been changed.");
  }
  const columnCount = Math.max(1, ...value.flatMap((row) =>
    Object.keys(row).map((key) => Number(key.slice(4)))));
  return {
    rows: value.map((row) => ({ ...emptyRow(columnCount), ...row })),
    columnCount,
  };
}

export function addColumn(table) {
  return {
    columnCount: table.columnCount + 1,
    rows: table.rows.map((row) => ({ ...row, [columnKey(table.columnCount)]: "" })),
  };
}

export function removeColumn(table, columnIndex) {
  if (!Number.isInteger(columnIndex) || columnIndex < 0 || columnIndex >= table.columnCount) {
    throw new Error("Select a column first.");
  }
  if (table.columnCount <= 1) throw new Error("Keep at least one column.");
  const remainingIndices = Array.from({ length: table.columnCount }, (_, index) => index)
    .filter((index) => index !== columnIndex);
  return {
    columnCount: table.columnCount - 1,
    rows: table.rows.map((row) => Object.fromEntries(remainingIndices.map((sourceIndex, targetIndex) =>
      [columnKey(targetIndex), row[columnKey(sourceIndex)]]))),
  };
}

export function addRow(table) {
  return { ...table, rows: [...table.rows, emptyRow(table.columnCount)] };
}

export function removeRow(table, rowIndex) {
  if (!Number.isInteger(rowIndex) || rowIndex <= 0 || rowIndex >= table.rows.length) {
    throw new Error("Select a content row. The heading row cannot be removed.");
  }
  return { ...table, rows: table.rows.filter((_, index) => index !== rowIndex) };
}

export const countPopulatedCells = (values) =>
  values.filter((value) => value !== null && value !== undefined && value !== "").length;