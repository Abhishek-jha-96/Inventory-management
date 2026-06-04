import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/api/client'

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'No records found.',
  children,
  skeleton = <DefaultSkeleton />,
}) {
  if (isLoading) {
    return skeleton
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load data</AlertTitle>
        <AlertDescription>{getErrorMessage(error)}</AlertDescription>
      </Alert>
    )
  }

  if (isEmpty) {
    return (
      <div className="rounded-lg bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return children
}

function DefaultSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-2/3" />
    </div>
  )
}
