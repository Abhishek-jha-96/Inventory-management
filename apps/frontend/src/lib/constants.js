export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

/** Products at or below this quantity are shown as low stock on the dashboard. */
export const LOW_STOCK_THRESHOLD = 10

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products' },
  { to: '/customers', label: 'Customers' },
  { to: '/orders', label: 'Orders' },
]
