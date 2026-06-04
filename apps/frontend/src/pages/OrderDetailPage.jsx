import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { OrderDetailView } from '@/components/orders/OrderDetailView'
import { QueryState } from '@/components/shared/QueryState'
import { useCustomer } from '@/hooks/use-customers'
import { useOrder } from '@/hooks/use-orders'
import { useProducts } from '@/hooks/use-products'

export function OrderDetailPage() {
  const { orderId } = useParams()
  const id = Number(orderId)

  const orderQuery = useOrder(id)
  const customerQuery = useCustomer(orderQuery.data?.customer_id)
  const productsQuery = useProducts()

  const productsById = useMemo(() => {
    const map = new Map()
    for (const product of productsQuery.data ?? []) {
      map.set(product.id, product)
    }
    return map
  }, [productsQuery.data])

  const isLoading =
    orderQuery.isLoading ||
    customerQuery.isLoading ||
    productsQuery.isLoading

  const isError =
    orderQuery.isError ||
    customerQuery.isError ||
    productsQuery.isError

  const error =
    orderQuery.error ?? customerQuery.error ?? productsQuery.error

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {orderQuery.data ? (
        <OrderDetailView
          order={orderQuery.data}
          customer={customerQuery.data}
          productsById={productsById}
        />
      ) : null}
    </QueryState>
  )
}
