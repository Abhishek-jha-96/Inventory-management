import { useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
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
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getErrorMessage } from '@/lib/api/client'
import { orderSchema } from '@/lib/schemas/order'
import { useCreateOrder } from '@/hooks/use-orders'

const EMPTY_LINE = { product_id: '', quantity: '1' }

export function CreateOrderDialog({
  open,
  onOpenChange,
  customers,
  products,
}) {
  const createMutation = useCreateOrder()

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_id: '',
      items: [EMPTY_LINE],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        value: String(product.id),
        label: `${product.name} (${product.sku}) — ${product.quantity_in_stock} in stock`,
      })),
    [products],
  )

  function handleOpenChange(nextOpen) {
    if (!nextOpen) {
      form.reset({ customer_id: '', items: [EMPTY_LINE] })
    }
    onOpenChange(nextOpen)
  }

  async function onSubmit(values) {
    try {
      await createMutation.mutateAsync({
        customer_id: values.customer_id,
        items: values.items.map((line) => ({
          product_id: line.product_id,
          quantity: line.quantity,
        })),
      })
      toast.success('Order created')
      handleOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create order</DialogTitle>
          <DialogDescription>
            Select a customer and add one or more product lines.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="customer_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel>Customer</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.value ? String(field.value) : null}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={String(customer.id)}
                          >
                            {customer.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </FieldContent>
                </Field>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Line items</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append(EMPTY_LINE)}
                >
                  <Plus className="size-4" />
                  Add line
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-lg bg-muted/30 p-4 sm:grid-cols-[1fr_120px_auto]"
                >
                  <Controller
                    name={`items.${index}.product_id`}
                    control={form.control}
                    render={({ field: lineField, fieldState }) => (
                      <Field data-invalid={Boolean(fieldState.error)}>
                        <FieldLabel>Product</FieldLabel>
                        <FieldContent>
                          <Select
                            value={
                              lineField.value ? String(lineField.value) : null
                            }
                            onValueChange={(value) =>
                              lineField.onChange(Number(value))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {productOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />

                  <Field data-invalid={Boolean(form.formState.errors.items?.[index]?.quantity)}>
                    <FieldLabel>Qty</FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        {...form.register(`items.${index}.quantity`)}
                      />
                      <FieldError>
                        {form.formState.errors.items?.[index]?.quantity?.message}
                      </FieldError>
                    </FieldContent>
                  </Field>

                  <div className="flex items-end justify-end pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove line"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {form.formState.errors.items?.message ? (
                <FieldError>{form.formState.errors.items.message}</FieldError>
              ) : null}
            </div>
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
              {createMutation.isPending ? 'Creating…' : 'Create order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
