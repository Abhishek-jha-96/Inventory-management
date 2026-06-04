import { CustomerTable } from '@/components/customers/CustomerTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryState } from '@/components/shared/QueryState'
import { useCustomers } from '@/hooks/use-customers'

export function CustomersPage() {
  const { data, isLoading, isError, error } = useCustomers()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        description="Register customers and maintain contact details."
      />

      <QueryState isLoading={isLoading} isError={isError} error={error}>
        <CustomerTable customers={data ?? []} />
      </QueryState>
    </div>
  )
}
