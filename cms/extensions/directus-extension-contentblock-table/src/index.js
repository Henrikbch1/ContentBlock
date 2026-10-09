import { defineInterface } from "@directus/extensions-sdk";
import TableEditor from "./TableEditor.js";

export default defineInterface({
  id: "contentblock-table",
  name: "ContentBlock Table",
  icon: "table_chart",
  description: "Per-table columns with protected headings and reversible row and column removal.",
  component: TableEditor,
  types: ["json"],
  group: "selection",
  options: [],
});