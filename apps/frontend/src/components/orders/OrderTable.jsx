import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'

export function OrderTable({ orders, customersById }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const customer = customersById.get(order.customer_id)
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>
                  {customer?.full_name ?? `Customer #${order.customer_id}`}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {order.items.length}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(order.total_amount)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    to={`/orders/${order.id}`}
                    aria-label={`View order ${order.id}`}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
                  >
                    <Eye className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
