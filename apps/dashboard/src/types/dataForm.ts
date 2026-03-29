/**
 * Declarative field definitions for {@link DataForm}.
 * Extend with new `type` discriminators as your product grows.
 */

export type FormFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'

export interface SelectOption {
  value: string
  label: string
}

interface FormFieldCommon {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  /** Grid columns on `sm+` (1 or 2). Defaults to 1. */
  colSpan?: 1 | 2
  /** Optional hint below the control */
  helperText?: string
}

export type FormField =
  | (FormFieldCommon & {
      type: 'text' | 'email' | 'number' | 'tel' | 'password'
    })
  | (FormFieldCommon & { type: 'textarea'; rows?: number })
  | (FormFieldCommon & { type: 'select'; options: SelectOption[] })
  | (FormFieldCommon & { type: 'checkbox' })

/** Values produced by the form on submit (checkboxes are boolean). */
export type FormValues = Record<string, string | number | boolean | undefined>
