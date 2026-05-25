import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CustomerTypeBadge } from '../../components/domain/CustomerBadges'
import { useOperationsData } from '../../providers/OperationsDataContext'

const actionBtn =
  'rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-colors'

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>()
  const { getCustomer } = useOperationsData()
  const customer = customerId ? getCustomer(customerId) : undefined

  if (!customer) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-slate-600 dark:text-slate-300">Customer not found.</p>
        <Link
          to="/customers"
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back to customers
        </Link>
      </div>
    )
  }

  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Customer ID', value: <code className="text-sm">{customer.id}</code> },
    { label: 'Name', value: customer.name || '—' },
    { label: 'Email', value: customer.email || '—' },
    { label: 'Phone', value: customer.phone || '—' },
    {
      label: 'Customer Type',
      value: <CustomerTypeBadge type={customer.customerType} />,
    },
    {
      label: 'Preferred Location',
      value: customer.preferredLocation || 'Not set',
    },
    {
      label: 'Preferred Services',
      value: customer.preferredServices.length > 0 
        ? customer.preferredServices.join(', ') 
        : 'Not set',
    },
    {
      label: 'Total Jobs Posted',
      value: customer.totalJobsPosted,
    },
    {
      label: 'Total Spent',
      value: `$${customer.totalSpent.toFixed(2)}`,
    },
    {
      label: 'Reputation Score',
      value: customer.reputationScore.toFixed(1),
    },
    {
      label: 'Billing Address',
      value: customer.billingAddress || 'Not set',
    },
    {
      label: 'Communication Preference',
      value: customer.communicationPref,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {customer.name || 'Customer'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {customer.email} · {customer.customerType}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/customers"
            className={`${actionBtn} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
          >
            Back to list
          </Link>
          <Link
            to={`/customers/${customer.id}/edit`}
            className={`${actionBtn} bg-indigo-600 font-semibold text-white hover:bg-indigo-500`}
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
        <dl className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-8"
            >
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {row.label}
              </dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
