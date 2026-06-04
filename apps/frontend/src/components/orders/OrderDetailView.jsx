import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'

export function OrderDetailView({ order, customer, productsById }) {
  return (
    <div className="space-y-8">
      <Link
        to="/orders"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-fit')}
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      <Card>
        <CardHeader>
          <CardDescription>Order</CardDescription>
          <CardTitle className="font-serif text-3xl">#{order.id}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="text-sm font-medium">
              {customer?.full_name ?? `Customer #${order.customer_id}`}
            </p>
            {customer?.email ? (
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            ) : null}
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-muted-foreground">Total amount</p>
            <p className="font-serif text-2xl font-medium tabular-nums">
              {formatCurrency(order.total_amount)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-serif text-xl font-medium">Line items</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => {
                const product = productsById.get(item.product_id)
                const lineTotal = Number(item.unit_price) * item.quantity
                return (
                  <TableRow key={`${item.product_id}-${index}`}>
                    <TableCell className="font-medium">
                      {product?.name ?? `Product #${item.product_id}`}
                      {product?.sku ? (
                        <span className="ml-2 text-muted-foreground">
                          {product.sku}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(item.unit_price)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(lineTotal)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
