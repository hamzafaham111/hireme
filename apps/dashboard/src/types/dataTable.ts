import type { ReactNode } from 'react'

/**
 * Declarative column config for {@link DataTable}.
 * `key` must exist on each row object; use `cell` for badges, formatting, or actions.
 */
export interface DataTableColumn<Row extends object> {
  key: keyof Row & string
  header: string
  cell?: (row: Row) => ReactNode
  /** Tailwind classes for `<td>` */
  className?: string
  /** Tailwind classes for `<th>` */
  headerClassName?: string
}

export interface DataTableProps<Row extends object> {
  columns: DataTableColumn<Row>[]
  rows: Row[]
  /** Stable id for React keys (e.g. row => row.id) */
  rowKey: (row: Row, index: number) => string
  /** Shown when `rows.length === 0` */
  emptyMessage?: string
  /** Accessible table caption */
  caption?: string
  className?: string
  /** Tailwind min-width etc. for wide tables (default `min-w-[640px]`) */
  tableClassName?: string
}
