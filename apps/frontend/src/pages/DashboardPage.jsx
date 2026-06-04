import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LowStockTable } from '@/components/dashboard/LowStockTable'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { PageHeader } from '@/components/shared/PageHeader'
import { QueryState } from '@/components/shared/QueryState'
import { useDashboard } from '@/hooks/use-dashboard'

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard()

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard"
        description="Overview of inventory, customers, and orders."
      />

      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {data ? (
          <>
            <SummaryCards stats={data} />
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl font-medium">
                  Low stock products
                </CardTitle>
                <CardDescription>
                  Products at or below the configured threshold.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LowStockTable products={data.lowStockProducts} />
              </CardContent>
            </Card>
          </>
        ) : null}
      </QueryState>
    </div>
  )
}
