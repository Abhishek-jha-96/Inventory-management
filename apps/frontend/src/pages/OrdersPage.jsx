import { useMemo, useState } from 'react'
import { CreateOrderDialog } from '@/components/orders/CreateOrderDialog'
import { OrderTable } from '@/components/orders/OrderTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryState } from '@/components/shared/QueryState'
import { Button } from '@/components/ui/button'
import { useCustomers } from '@/hooks/use-customers'
import { useOrders } from '@/hooks/use-orders'
import { useProducts } from '@/hooks/use-products'

export function OrdersPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const ordersQuery = useOrders()
  const customersQuery = useCustomers()
  const productsQuery = useProducts()

  const isLoading =
    ordersQuery.isLoading ||
    customersQuery.isLoading ||
    productsQuery.isLoading

  const isError =
    ordersQuery.isError ||
    customersQuery.isError ||
    productsQuery.isError

  const error =
    ordersQuery.error ?? customersQuery.error ?? productsQuery.error

  const customersById = useMemo(() => {
    const map = new Map()
    for (const customer of customersQuery.data ?? []) {
      map.set(customer.id, customer)
    }
    return map
  }, [customersQuery.data])

  const canCreate =
    (customersQuery.data?.length ?? 0) > 0 &&
    (productsQuery.data?.length ?? 0) > 0

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        description="Create orders and review purchase history."
        action={
          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            disabled={!canCreate && !isLoading}
          >
            Create order
          </Button>
        }
      />

      {!canCreate && !isLoading && !isError ? (
        <p className="text-sm text-muted-foreground">
          Add at least one customer and one product before creating an order.
        </p>
      ) : null}

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!ordersQuery.data?.length}
        emptyMessage="No orders yet. Create your first order when ready."
      >
        {ordersQuery.data?.length ? (
          <OrderTable
            orders={ordersQuery.data}
            customersById={customersById}
          />
        ) : null}
      </QueryState>

      <CreateOrderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        customers={customersQuery.data ?? []}
        products={productsQuery.data ?? []}
      />
    </div>
  )
}
