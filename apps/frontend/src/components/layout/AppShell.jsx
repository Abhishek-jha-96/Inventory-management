import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { useUiStore } from '@/stores/use-ui-store'

export function AppShell() {
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)

  return (
    <div className="min-h-svh bg-background">
      <div className="flex min-h-svh">
        <aside className="hidden w-56 shrink-0 bg-card lg:block">
          <div className="sticky top-0 flex h-svh flex-col">
            <div className="border-b border-foreground/5 px-6 py-6">
              <p className="font-serif text-xl font-medium tracking-tight">
                Ethara
              </p>
              <p className="text-xs text-muted-foreground">Inventory & orders</p>
            </div>
            <SidebarNav />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 bg-card px-4 py-4 lg:hidden">
            <div>
              <p className="font-serif text-lg font-medium">Ethara</p>
              <p className="text-xs text-muted-foreground">Inventory & orders</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <Outlet />
          </main>
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-foreground/5 px-6 py-6 text-left">
            <SheetTitle className="font-serif text-xl font-medium">
              Ethara
            </SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
