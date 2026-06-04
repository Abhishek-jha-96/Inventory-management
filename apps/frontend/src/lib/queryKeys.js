export const queryKeys = {
  products: {
    all: ['products'],
    detail: (id) => ['products', id],
  },
  customers: {
    all: ['customers'],
    detail: (id) => ['customers', id],
  },
  orders: {
    all: ['orders'],
    detail: (id) => ['orders', id],
  },
  dashboard: ['dashboard'],
}
