import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldGroup } from '@/components/ui/field'
import { TextFormField } from '@/components/shared/FormField'
import { getErrorMessage } from '@/lib/api/client'
import { customerSchema } from '@/lib/schemas/customer'
import { useCreateCustomer } from '@/hooks/use-customers'

const EMPTY_VALUES = {
  full_name: '',
  email: '',
  phone_number: '',
}

export function CustomerFormDialog({ open, onOpenChange }) {
  const createMutation = useCreateCustomer()

  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: EMPTY_VALUES,
  })

  function handleOpenChange(nextOpen) {
    if (!nextOpen) {
      form.reset(EMPTY_VALUES)
    }
    onOpenChange(nextOpen)
  }

  async function onSubmit(values) {
    try {
      await createMutation.mutateAsync(values)
      toast.success('Customer created')
      handleOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add customer</DialogTitle>
          <DialogDescription>
            Register a new customer for order placement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <TextFormField
              id="full_name"
              label="Full name"
              registration={form.register('full_name')}
              error={form.formState.errors.full_name}
            />
            <TextFormField
              id="email"
              label="Email"
              type="email"
              registration={form.register('email')}
              error={form.formState.errors.email}
            />
            <TextFormField
              id="phone_number"
              label="Phone number"
              registration={form.register('phone_number')}
              error={form.formState.errors.phone_number}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving…' : 'Create customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
