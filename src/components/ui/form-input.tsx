"use client"

import { Eye, EyeOff, Search, X, Check, Minus } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/cn"

/* ------------------------------------------------------------------ *
 * Form Field Wrapper (Accessible Label, Helper & Error Message)
 * ------------------------------------------------------------------ */

interface FormFieldContextValue {
  id: string
  errorId: string
  descriptionId: string
  hasError: boolean
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

export function useFormField() {
  return React.useContext(FormFieldContext)
}

export interface FormFieldProps {
  children: React.ReactNode
  id?: string
  label?: string
  description?: string
  error?: string
  required?: boolean
  className?: string
}

export function FormField({
  children,
  id: customId,
  label,
  description,
  error,
  required = false,
  className,
}: FormFieldProps) {
  const generatedId = React.useId()
  const id = customId || generatedId
  const errorId = `${id}-error`
  const descriptionId = `${id}-description`
  const hasError = Boolean(error)

  return (
    <FormFieldContext.Provider value={{ id, errorId, descriptionId, hasError }}>
      <div className={cn("flex w-full flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={id}
            className="flex items-center gap-1 text-[13px] font-medium leading-none text-[var(--oreo-text-primary)] select-none"
          >
            <span>{label}</span>
            {required && <span className="text-[var(--oreo-status-error)]" aria-hidden="true">*</span>}
          </label>
        )}

        {children}

        {description && !error && (
          <p id={descriptionId} className="text-[12px] leading-[1.33] text-[var(--oreo-text-secondary)]">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-[12px] font-medium leading-[1.33] text-[var(--oreo-status-error)]">
            {error}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  )
}

/* ------------------------------------------------------------------ *
 * Standard Input (Text, Search, Password, Icons)
 * ------------------------------------------------------------------ */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  isSearch?: boolean
  isPassword?: boolean
  onClear?: () => void
  error?: boolean
  /** md is a 44px field with 16px type so mobile browsers do not zoom on focus. */
  size?: "sm" | "md"
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      leadingIcon,
      trailingIcon,
      isSearch = false,
      isPassword = false,
      onClear,
      error: errorProp,
      size = "sm",
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const fieldContext = useFormField()
    const id = props.id || fieldContext?.id
    const hasError = errorProp !== undefined ? errorProp : fieldContext?.hasError
    const [showPassword, setShowPassword] = React.useState(false)

    const actualType = isPassword ? (showPassword ? "text" : "password") : type
    const showClear = isSearch && Boolean(value) && !disabled

    return (
      <div className="relative flex w-full items-center">
        {/* Leading Icon / Search Icon */}
        {isSearch ? (
          <span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center text-[var(--oreo-text-secondary)]">
            <Search size={15} />
          </span>
        ) : leadingIcon ? (
          <span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center text-[var(--oreo-text-secondary)]">
            {leadingIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={id}
          type={actualType}
          disabled={disabled}
          value={value}
          onChange={onChange}
          aria-invalid={hasError || undefined}
          aria-describedby={
            fieldContext ? (hasError ? fieldContext.errorId : fieldContext.descriptionId) : undefined
          }
          className={cn(
            "flex w-full rounded-[var(--oreo-radius-sm)] border bg-[var(--oreo-bg-surface)] px-3 cursor-text leading-[1.43] text-[var(--oreo-text-primary)] transition-colors placeholder:text-[var(--oreo-text-placeholder)]",
            size === "md" ? "h-11 text-[16px]" : "h-[36px] text-[14px]",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
            "disabled:cursor-not-allowed disabled:opacity-30 disabled:bg-[var(--oreo-bg-elevated)] read-only:cursor-text read-only:bg-[var(--oreo-bg-elevated)]",
            leadingIcon || isSearch ? "pl-9" : "pl-3",
            trailingIcon || isPassword || showClear ? "pr-9" : "pr-3",
            hasError
              ? "border-[var(--oreo-status-error)] focus-visible:ring-[var(--oreo-status-error)]"
              : "border-[var(--oreo-border-default)]",
            className
          )}
          {...props}
        />

        {/* Trailing Controls: Clear or Password Toggle or Trailing Icon */}
        {showClear ? (
          <span className="absolute right-2 flex items-center">
            <IconButton
              type="button"
              variant="ghost"
              aria-label="Clear search"
              icon={<X size={14} />}
              onClick={onClear}
              className="size-[24px] text-[var(--oreo-text-tertiary)] hover:text-[var(--oreo-text-primary)]"
            />
          </span>
        ) : isPassword ? (
          <span className="absolute right-2 flex items-center">
            <IconButton
              type="button"
              variant="ghost"
              aria-label={showPassword ? "Hide password" : "Show password"}
              icon={showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              onClick={() => setShowPassword(!showPassword)}
              className="size-[24px] text-[var(--oreo-text-tertiary)] hover:text-[var(--oreo-text-primary)]"
            />
          </span>
        ) : trailingIcon ? (
          <span className="pointer-events-none absolute right-3 flex size-4 items-center justify-center text-[var(--oreo-text-secondary)]">
            {trailingIcon}
          </span>
        ) : null}
      </div>
    )
  }
)
Input.displayName = "Input"

/* ------------------------------------------------------------------ *
 * Textarea (Auto-Resizing & Character Count)
 * ------------------------------------------------------------------ */

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxCharacters?: number
  error?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxCharacters, error: errorProp, disabled, value, onChange, ...props }, ref) => {
    const fieldContext = useFormField()
    const id = props.id || fieldContext?.id
    const hasError = errorProp !== undefined ? errorProp : fieldContext?.hasError
    const currentLength = typeof value === "string" ? value.length : 0

    return (
      <div className="relative flex w-full flex-col">
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          value={value}
          onChange={onChange}
          maxLength={maxCharacters}
          aria-invalid={hasError || undefined}
          aria-describedby={
            fieldContext ? (hasError ? fieldContext.errorId : fieldContext.descriptionId) : undefined
          }
          className={cn(
            "flex min-h-[80px] w-full rounded-[var(--oreo-radius-sm)] border bg-[var(--oreo-bg-surface)] p-3 cursor-text text-[14px] leading-[1.43] text-[var(--oreo-text-primary)] transition-colors placeholder:text-[var(--oreo-text-placeholder)]",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
            "disabled:cursor-not-allowed disabled:opacity-30 disabled:bg-[var(--oreo-bg-elevated)]",
            hasError
              ? "border-[var(--oreo-status-error)] focus-visible:ring-[var(--oreo-status-error)]"
              : "border-[var(--oreo-border-default)]",
            className
          )}
          {...props}
        />

        {maxCharacters !== undefined && (
          <div className="mt-1 flex justify-end font-mono text-[11px] text-[var(--oreo-text-tertiary)]">
            <span>
              {currentLength} / {maxCharacters}
            </span>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

/* ------------------------------------------------------------------ *
 * Switch (Toggle)
 * ------------------------------------------------------------------ */

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  label?: string
  description?: string
  className?: string
}

export function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  id,
  label,
  description,
  className,
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : uncontrolledChecked
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const reduceMotion = useReducedMotion()

  function handleChange(next: boolean) {
    if (!isControlled) setUncontrolledChecked(next)
    onCheckedChange?.(next)
  }

  // A real checkbox carries the semantics, keyboard behaviour and label association;
  // the track and knob are pure presentation driven off :checked / :focus-visible.
  return (
    <label
      htmlFor={inputId}
      data-disabled={disabled || undefined}
      className={cn(
        description ? "inline-flex min-h-[24px] oreo-clickable items-start gap-2.5" : "inline-flex min-h-[24px] oreo-clickable items-center gap-2.5",
        className
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => handleChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-[20px] w-[36px] shrink-0 items-center rounded-full border border-transparent transition-colors duration-200",
          "peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-[var(--oreo-border-focus)]",
          "peer-disabled:opacity-30",
          checked ? "bg-[var(--oreo-bg-inverse)]" : "bg-[var(--oreo-border-default)]"
        )}
      >
        <motion.span
          animate={{ x: checked ? 16 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.2, 0, 0, 1] }}
          className="pointer-events-none inline-block size-[16px] rounded-full bg-[var(--oreo-bg-base)] shadow-sm"
        />
      </span>

      {label && (
        <span className={cn("min-w-0 select-none", disabled && "opacity-30")}>
          <span className="block text-[14px] leading-snug text-[var(--oreo-text-primary)]">{label}</span>
          {description ? <span className="mt-0.5 block text-[12px] leading-[1.4] text-[var(--oreo-text-secondary)]">{description}</span> : null}
        </span>
      )}
    </label>
  )
}

/* ------------------------------------------------------------------ *
 * Checkbox
 * ------------------------------------------------------------------ */

export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
  disabled?: boolean
  id?: string
  label?: string
  description?: string
  className?: string
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  disabled = false,
  id,
  label,
  description,
  className,
}: CheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : uncontrolledChecked
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const inputRef = React.useRef<HTMLInputElement>(null)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  function handleChange(next: boolean) {
    if (!isControlled) setUncontrolledChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <label
      htmlFor={inputId}
      data-disabled={disabled || undefined}
      className={cn(
        description ? "inline-flex min-h-[24px] oreo-clickable items-start gap-2" : "inline-flex min-h-[24px] oreo-clickable items-center gap-2",
        className
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => handleChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "grid size-[18px] shrink-0 place-items-center rounded-[var(--oreo-radius-xs)] border transition-colors",
          "peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-[var(--oreo-border-focus)]",
          "peer-disabled:opacity-30",
          checked || indeterminate
            ? "border-[var(--oreo-bg-inverse)] bg-[var(--oreo-bg-inverse)] text-[var(--oreo-text-on-inverse)]"
            : "border-[var(--oreo-border-default)] bg-[var(--oreo-bg-surface)]"
        )}
      >
        {indeterminate ? (
          <Minus size={12} strokeWidth={3} />
        ) : checked ? (
          <motion.span initial={{ scale: reduceMotion ? 1 : 0.6 }} animate={{ scale: 1 }}>
            <Check size={12} strokeWidth={3} />
          </motion.span>
        ) : null}
      </span>

      {label && (
        <span className={cn("min-w-0 select-none", disabled && "opacity-30")}>
          <span className="block text-[14px] leading-snug text-[var(--oreo-text-primary)]">{label}</span>
          {description ? <span className="mt-0.5 block text-[12px] leading-[1.4] text-[var(--oreo-text-secondary)]">{description}</span> : null}
        </span>
      )}
    </label>
  )
}
