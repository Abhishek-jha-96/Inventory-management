import { ProductTable } from '@/components/products/ProductTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryState } from '@/components/shared/QueryState'
import { useProducts } from '@/hooks/use-products'

export function ProductsPage() {
  const { data, isLoading, isError, error } = useProducts()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Products"
        description="Manage catalog items, pricing, and stock levels."
      />

      <QueryState isLoading={isLoading} isError={isError} error={error}>
        <ProductTable products={data ?? []} />
      </QueryState>
    </div>
  )
}
