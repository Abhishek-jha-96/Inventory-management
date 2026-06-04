import { apiRequest } from '@/lib/api/client'

export function fetchOrders() {
  return apiRequest('/orders')
}

export function fetchOrder(id) {
  return apiRequest(`/orders/${id}`)
}

export function createOrder(payload) {
  return apiRequest('/orders', { method: 'POST', body: payload })
}
