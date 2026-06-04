import { useEffect } from 'react'
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
import { productSchema } from '@/lib/schemas/product'
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-products'

const EMPTY_VALUES = {
  name: '',
  sku: '',
  price: '',
  quantity_in_stock: '',
}

export function ProductFormDialog({ open, onOpenChange, product }) {
  const isEdit = Boolean(product)
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!open) return
    if (product) {
      form.reset({
        name: product.name,
        sku: product.sku,
        price: String(product.price),
        quantity_in_stock: String(product.quantity_in_stock),
      })
    } else {
      form.reset(EMPTY_VALUES)
    }
  }, [open, product, form])

  async function onSubmit(values) {
    const payload = {
      name: values.name,
      sku: values.sku,
      price: values.price,
      quantity_in_stock: values.quantity_in_stock,
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: product.id, payload })
        toast.success('Product updated')
      } else {
        await createMutation.mutateAsync(payload)
        toast.success('Product created')
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Update product' : 'Add product'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Change product details and save.'
              : 'Add a new product to your catalog.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <TextFormField
              id="name"
              label="Name"
              registration={form.register('name')}
              error={form.formState.errors.name}
            />
            <TextFormField
              id="sku"
              label="SKU"
              registration={form.register('sku')}
              error={form.formState.errors.sku}
            />
            <TextFormField
              id="price"
              label="Price"
              type="number"
              step="0.01"
              min="0.01"
              registration={form.register('price')}
              error={form.formState.errors.price}
            />
            <TextFormField
              id="quantity_in_stock"
              label="Quantity in stock"
              type="number"
              step="1"
              min="0"
              registration={form.register('quantity_in_stock')}
              error={form.formState.errors.quantity_in_stock}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
