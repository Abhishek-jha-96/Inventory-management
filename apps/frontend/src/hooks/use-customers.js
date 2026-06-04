import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCustomer,
  deleteCustomer,
  fetchCustomer,
  fetchCustomers,
} from '@/lib/api/customers'
import { queryKeys } from '@/lib/queryKeys'

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: fetchCustomers,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })
}

export function useCustomer(id) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => fetchCustomer(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}
