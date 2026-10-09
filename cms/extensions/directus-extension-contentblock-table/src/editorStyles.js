export const editorStyles = `
.contentblock-table-editor { min-width: 0; width: 100%; }
.contentblock-table-grid { max-height: 560px; overflow: auto; }
.contentblock-table-grid > div:last-child:not(:first-child) { display: none; }
.contentblock-table-grid .ag-theme-quartz {
  --ag-font-family: var(--theme--fonts--sans--font-family);
  --ag-background-color: var(--theme--background);
  --ag-foreground-color: var(--theme--foreground);
  --ag-header-background-color: var(--theme--background-subdued);
  --ag-header-foreground-color: var(--theme--foreground);
  --ag-border-color: var(--theme--border-color);
  --ag-active-color: var(--theme--primary);
  --ag-selected-row-background-color: var(--theme--primary-background);
}
.contentblock-table-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.contentblock-table-button {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-height: 36px; min-width: 36px; padding: 6px 10px; border-radius: 4px;
  background: var(--theme--background-accent); color: var(--theme--foreground);
  font: inherit; font-size: 13px; cursor: pointer; border: 1px solid var(--theme--border-color);
}
.contentblock-table-button:hover:not(:disabled) { border-color: var(--theme--primary); }
.contentblock-table-button:disabled { opacity: .45; cursor: not-allowed; }
.contentblock-table-actions button:focus-visible { outline: 2px solid var(--theme--primary); outline-offset: 2px; }
.contentblock-table-status { margin-top: 8px; color: var(--theme--foreground-subdued); font-size: 12px; }
@media (prefers-reduced-motion: reduce) {
  .contentblock-table-editor * { transition: none !important; animation: none !important; }
}
`;