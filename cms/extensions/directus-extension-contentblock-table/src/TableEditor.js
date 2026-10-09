import { computed, defineComponent, h, ref, resolveComponent, shallowRef, watch } from "vue";
import upstreamInterface from "#grid-interface";
import { addColumn, addRow, columnKey, countPopulatedCells, readTable, removeColumn, removeRow } from "./tableData.js";
import { editorStyles } from "./editorStyles.js";

const HISTORY_LIMIT = 30;
const cloneRows = (rows) => rows.map((row) => ({ ...row }));

export default defineComponent({
  name: "ContentBlockTableEditor",
  props: {
    value: { default: null },
    primaryKey: { type: [String, Number], default: null },
    collection: { type: String, required: true },
    field: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    nonEditable: { type: Boolean, default: false },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const table = shallowRef(readTable(null));
    const history = shallowRef([]);
    const error = ref("");
    const selection = ref({ row: null, column: null });
    const locked = computed(() => props.disabled || props.nonEditable || Boolean(error.value));
    const gridRows = computed(() => cloneRows(table.value.rows));
    let lastEmitted = null;

    watch(() => props.value, (value) => {
      if (JSON.stringify(value) === lastEmitted) return;
      history.value = [];
      selection.value = { row: null, column: null };
      try {
        table.value = readTable(value);
        error.value = "";
      } catch (problem) {
        error.value = problem.message;
      }
    }, { immediate: true, deep: true });

    function emitRows() {
      const rows = cloneRows(table.value.rows);
      lastEmitted = JSON.stringify(rows);
      emit("input", rows);
    }

    function commit(nextTable) {
      if (locked.value) return;
      history.value = [...history.value.slice(-(HISTORY_LIMIT - 1)), table.value];
      table.value = nextTable;
      emitRows();
    }

    function updateCells(rows) {
      if (locked.value || JSON.stringify(rows) === JSON.stringify(table.value.rows)) return;
      commit(readTable(rows));
    }

    function undo() {
      if (locked.value || history.value.length === 0) return;
      table.value = history.value.at(-1);
      history.value = history.value.slice(0, -1);
      selection.value = { row: null, column: null };
      emitRows();
    }

    function deleteColumn() {
      const column = selection.value.column;
      if (locked.value || column === null || table.value.columnCount <= 1) return;
      const values = table.value.rows.map((row) => row[columnKey(column)]);
      const label = String(values[0] ?? "").slice(0, 80);
      const message = `Remove column ${column + 1}${label ? ` (${label})` : ""}?\n` +
        `${countPopulatedCells(values)} populated cells, including the heading, will be removed.\n` +
        "This affects only this table. Changes remain pending until Save.";
      if (!globalThis.confirm(message)) return;
      commit(removeColumn(table.value, column));
      selection.value = { row: null, column: null };
    }

    function deleteRow() {
      const row = selection.value.row;
      if (locked.value || row === null || row <= 0) return;
      const count = countPopulatedCells(Object.values(table.value.rows[row]));
      if (!globalThis.confirm(`Remove row ${row + 1}?\n${count} populated cells will be removed.\n` +
        "This affects only this table. Changes remain pending until Save.")) return;
      commit(removeRow(table.value, row));
      selection.value = { row: null, column: null };
    }

    function trackFocus(event) {
      const field = event.column?.getColId();
      if (event.rowIndex === null || !/^col_[1-9]\d*$/.test(field ?? "")) return;
      selection.value = { row: event.rowIndex, column: Number(field.slice(4)) - 1 };
    }

    const columns = computed(() => Array.from({ length: table.value.columnCount }, (_, index) => ({
      colId: columnKey(index),
      field: columnKey(index),
      headerName: `Column ${index + 1}`,
      cellEditor: "agTextCellEditor",
      editable: locked.value ? "false" : "true",
      singleClickEdit: true,
      wrapText: true,
      autoHeight: true,
      minWidth: 150,
      maxWidth: 500,
      flex: 1,
    })));

    const gridOptions = {
      headerHeight: 40,
      stopEditingWhenCellsLoseFocus: true,
      enableCellTextSelection: true,
      ensureDomOrder: true,
      animateRows: false,
      onCellFocused: trackFocus,
      defaultColDef: { sortable: false, filter: false, resizable: true, suppressMovable: true },
    };

    function button(label, icon, action, disabled = false, iconOnly = false) {
      return h("button", {
        type: "button",
        class: "contentblock-table-button",
        disabled: locked.value || disabled,
        onClick: action,
        title: label,
        "aria-label": label,
      }, [h(resolveComponent("v-icon"), { name: icon, "aria-hidden": "true" }), !iconOnly && h("span", label)]);
    }

    return () => h("div", { class: "contentblock-table-editor" }, [
      h("style", editorStyles),
      error.value ? h("p", { role: "alert" }, error.value) : h("div", { class: "contentblock-table-grid" }, [
        h(upstreamInterface.component, {
          value: gridRows.value,
          primaryKey: props.primaryKey,
          collection: props.collection,
          field: props.field,
          disabled: locked.value,
          columnDefinitions: columns.value,
          gridOptions,
          onInput: updateCells,
        }),
      ]),
      !props.nonEditable && h("div", { class: "contentblock-table-actions", role: "group", "aria-label": "Table actions" }, [
        button("Add row", "add", () => commit(addRow(table.value))),
        button("Add column", "view_column", () => commit(addColumn(table.value))),
        button("Remove column", "view_column", deleteColumn, selection.value.column === null || table.value.columnCount <= 1),
        button("Remove row", "delete_outline", deleteRow, selection.value.row === null || selection.value.row <= 0),
        button("Undo", "undo", undo, history.value.length === 0, true),
      ]),
      !error.value && h("p", { class: "contentblock-table-status", "aria-live": "polite" },
        selection.value.column === null
          ? `${table.value.columnCount} columns / ${table.value.rows.length - 1} content rows`
          : `Column ${selection.value.column + 1} / ${selection.value.row === 0 ? "Heading row" : `Row ${selection.value.row + 1}`}`),
    ]);
  },
});