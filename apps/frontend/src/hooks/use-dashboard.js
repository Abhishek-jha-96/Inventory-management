import { useQuery } from '@tanstack/react-query'
import { fetchCustomers } from '@/lib/api/customers'
import { fetchOrders } from '@/lib/api/orders'
import { fetchProducts } from '@/lib/api/products'
import { LOW_STOCK_THRESHOLD } from '@/lib/constants'
import { queryKeys } from '@/lib/queryKeys'

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      const [products, customers, orders] = await Promise.all([
        fetchProducts(),
        fetchCustomers(),
        fetchOrders(),
      ])

      const lowStockProducts = products.filter(
        (product) => product.quantity_in_stock <= LOW_STOCK_THRESHOLD,
      )

      return {
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalOrders: orders.length,
        lowStockProducts,
        products,
      }
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })
}
