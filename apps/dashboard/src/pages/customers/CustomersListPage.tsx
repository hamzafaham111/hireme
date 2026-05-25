import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataTable } from '../../components/data/DataTable'
import { CustomerTypeBadge } from '../../components/domain/CustomerBadges'
import {
  ListFilterToolbar,
  type StatusFilterOption,
} from '../../components/ui/ListFilterToolbar'
import { useOperationsData } from '../../providers/OperationsDataContext'
import type { DataTableColumn } from '../../types/dataTable'
import type { Customer } from '@hire-me/types'

const CUSTOMER_TYPE_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'All types' },
  { value: 'individual', label: 'Individual' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
]

function customerMatchesSearch(customer: Customer, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const blob = [
    customer.name,
    customer.email,
    customer.phone,
    customer.customerType,
    customer.preferredLocation,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return blob.includes(q)
}

function CurrencyCell({ value }: { value: number }) {
  return (
    <span className="tabular-nums text-slate-700 dark:text-slate-300">
      ${value.toFixed(2)}
    </span>
  )
}

function StarCell({ value }: { value: number }) {
  return (
    <span className="tabular-nums text-slate-700 dark:text-slate-300">
      {value.toFixed(1)}
    </span>
  )
}

export function CustomersListPage() {
  const { customers } = useOperationsData()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (typeFilter && c.customerType !== typeFilter) return false
      return customerMatchesSearch(c, searchQuery)
    })
  }, [customers, typeFilter, searchQuery])

  const columns = useMemo<DataTableColumn<Customer>[]>(
    () => [
      {
        key: 'name',
        header: 'Name',
        cell: (row) => row.name || '—',
      },
      {
        key: 'email',
        header: 'Email',
        cell: (row) => row.email || '—',
      },
      {
        key: 'phone',
        header: 'Phone',
        className: 'whitespace-nowrap',
        cell: (row) => row.phone || '—',
      },
      {
        key: 'customerType',
        header: 'Type',
        cell: (row) => <CustomerTypeBadge type={row.customerType} />,
      },
      {
        key: 'totalJobsPosted',
        header: 'Jobs',
        headerClassName: 'text-right',
        className: 'text-right',
        cell: (row) => row.totalJobsPosted,
      },
      {
        key: 'totalSpent',
        header: 'Total Spent',
        headerClassName: 'text-right',
        className: 'text-right',
        cell: (row) => <CurrencyCell value={row.totalSpent} />,
      },
      {
        key: 'reputationScore',
        header: 'Reputation',
        headerClassName: 'text-right',
        className: 'text-right',
        cell: (row) => <StarCell value={row.reputationScore} />,
      },
      {
        key: 'id',
        header: 'Actions',
        headerClassName:
          'min-w-[140px] whitespace-nowrap text-right align-middle',
        className: 'whitespace-nowrap text-right align-middle',
        cell: (row) => (
          <div className="flex flex-row flex-nowrap items-center justify-end gap-2">
            <Link
              to={`/customers/${row.id}`}
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
            >
              View
            </Link>
            <Link
              to={`/customers/${row.id}/edit`}
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Edit
            </Link>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Marketplace customer profiles. Customers register via the web app; manage their preferences and view activity here.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <ListFilterToolbar
          idPrefix="customers"
          searchPlaceholder="Search by name, email, phone, location…"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          statusValue={typeFilter}
          onStatusChange={setTypeFilter}
          statusOptions={CUSTOMER_TYPE_OPTIONS}
        />
      </div>

      <DataTable<Customer>
        caption="Customers"
        columns={columns}
        rows={filteredCustomers}
        rowKey={(row) => row.id}
        tableClassName="min-w-[1120px]"
        emptyMessage={
          customers.length > 0 && filteredCustomers.length === 0
            ? 'No customers match your search or type filter.'
            : 'No customers yet.'
        }
      />
    </div>
  )
}
