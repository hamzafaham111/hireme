'use client'

import { useRef, type KeyboardEvent } from 'react'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  length?: number
}

export function OTPInput({ value, onChange, onComplete, length = 6 }: OTPInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split('')
    newValue[index] = digit
    const updated = newValue.join('')
    onChange(updated)

    // Auto-advance to next input
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }

    // Trigger onComplete when all digits entered
    if (updated.length === length && updated.split('').every((d) => d)) {
      onComplete?.(updated)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pastedData)
    
    // Focus last filled input or first empty
    const focusIndex = Math.min(pastedData.length, length - 1)
    inputs.current[focusIndex]?.focus()
    
    if (pastedData.length === length) {
      onComplete?.(pastedData)
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="size-12 text-center text-2xl font-bold rounded-lg border-2 border-slate-300 bg-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-900/50 dark:text-white sm:size-14"
        />
      ))}
    </div>
  )
}
