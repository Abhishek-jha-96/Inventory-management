import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOrder, fetchOrder, fetchOrders } from '@/lib/api/orders'
import { queryKeys } from '@/lib/queryKeys'

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: fetchOrders,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })
}

export function useOrder(id) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => fetchOrder(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}
