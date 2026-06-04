import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'

const ICONS = {
  '/': LayoutDashboard,
  '/products': Package,
  '/customers': Users,
  '/orders': ShoppingCart,
}

export function SidebarNav({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 p-4">
      {NAV_ITEMS.map(({ to, label, end }) => {
        const Icon = ICONS[to]
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              )
            }
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            {label}
          </NavLink>
        )
      })}
    </nav>
  )
}
