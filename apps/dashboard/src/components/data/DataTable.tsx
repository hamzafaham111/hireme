import type { DataTableProps } from "../../types/dataTable";

const thBase =
  "border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300";
const tdBase =
  "border-b border-slate-100 px-4 py-3 text-sm text-slate-800 dark:border-slate-800 dark:text-slate-200";

/**
 * Responsive data table: horizontal scroll on narrow viewports, shared by list pages.
 */
export function DataTable<Row extends object>({
  columns,
  rows,
  rowKey,
  emptyMessage = "No rows to display.",
  caption,
  className = "",
  tableClassName = "min-w-[640px]",
}: DataTableProps<Row>) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse text-left ${tableClassName}`}>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={`${thBase} first:pl-5 last:pr-5 ${col.headerClassName ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowKey(row, rowIndex)}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  {columns.map((col) => {
                    const raw = row[col.key];
                    const content = col.cell
                      ? col.cell(row)
                      : raw === null || raw === undefined
                        ? "—"
                        : String(raw);
                    return (
                      <td
                        key={String(col.key)}
                        className={`${tdBase} first:pl-5 last:pr-5 ${col.className ?? ""}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
