import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function TextFormField({
  id,
  label,
  error,
  registration,
  type = 'text',
  placeholder,
  step,
  min,
}) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          step={step}
          min={min}
          aria-invalid={Boolean(error)}
          {...registration}
        />
        <FieldError>{error?.message}</FieldError>
      </FieldContent>
    </Field>
  )
}
