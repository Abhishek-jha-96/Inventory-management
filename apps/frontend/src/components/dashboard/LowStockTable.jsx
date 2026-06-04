import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatNumber } from '@/lib/format'
import { LOW_STOCK_THRESHOLD } from '@/lib/constants'

export function LowStockTable({ products }) {
  if (!products.length) {
    return (
      <p className="text-sm text-muted-foreground">
        All products are above the low stock threshold ({LOW_STOCK_THRESHOLD}{' '}
        units).
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-muted-foreground">{product.sku}</TableCell>
              <TableCell className="text-right">
                <Badge variant={product.quantity_in_stock === 0 ? 'destructive' : 'secondary'}>
                  {formatNumber(product.quantity_in_stock)}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(product.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-xs text-muted-foreground">
        <Link to="/products" className="text-tertiary hover:underline">
          Manage products
        </Link>
      </p>
    </div>
  )
}
