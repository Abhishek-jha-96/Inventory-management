import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatNumber } from '@/lib/format'

const METRICS = [
  {
    key: 'totalProducts',
    label: 'Total products',
    description: 'Active catalog items',
    icon: Package,
  },
  {
    key: 'totalCustomers',
    label: 'Total customers',
    description: 'Registered customers',
    icon: Users,
  },
  {
    key: 'totalOrders',
    label: 'Total orders',
    description: 'Orders placed',
    icon: ShoppingCart,
  },
  {
    key: 'lowStockCount',
    label: 'Low stock',
    description: 'Products needing attention',
    icon: AlertTriangle,
    accent: true,
  },
]

export function SummaryCards({ stats }) {
  const values = {
    totalProducts: stats.totalProducts,
    totalCustomers: stats.totalCustomers,
    totalOrders: stats.totalOrders,
    lowStockCount: stats.lowStockProducts.length,
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {METRICS.map(({ key, label, description, icon: Icon, accent }) => (
        <Card key={key} size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="font-serif text-3xl font-medium tabular-nums">
                {formatNumber(values[key])}
              </CardTitle>
            </div>
            <div
              className={
                accent
                  ? 'text-tertiary'
                  : 'text-muted-foreground'
              }
            >
              <Icon className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
