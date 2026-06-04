import { apiRequest } from '@/lib/api/client'

export function fetchCustomers() {
  return apiRequest('/customers')
}

export function fetchCustomer(id) {
  return apiRequest(`/customers/${id}`)
}

export function createCustomer(payload) {
  return apiRequest('/customers', { method: 'POST', body: payload })
}

export function deleteCustomer(id) {
  return apiRequest(`/customers/${id}`, { method: 'DELETE' })
}
