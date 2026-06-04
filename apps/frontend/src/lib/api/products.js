import { apiRequest } from '@/lib/api/client'

export function fetchProducts() {
  return apiRequest('/products')
}

export function fetchProduct(id) {
  return apiRequest(`/products/${id}`)
}

export function createProduct(payload) {
  return apiRequest('/products', { method: 'POST', body: payload })
}

export function updateProduct(id, payload) {
  return apiRequest(`/products/${id}`, { method: 'PUT', body: payload })
}

export function deleteProduct(id) {
  return apiRequest(`/products/${id}`, { method: 'DELETE' })
}
