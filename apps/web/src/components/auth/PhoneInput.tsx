'use client'

import { useEffect, useState } from 'react'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  required?: boolean
}

export function PhoneInput({
  value,
  onChange,
  label = 'Phone number',
  error,
  required = false,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('+92') // Default Pakistan
  const [localNumber, setLocalNumber] = useState('')

  // Parse existing value on mount
  useEffect(() => {
    if (value && !localNumber) {
      // Extract country code and local number from value
      const match = value.match(/^(\+\d+)(\d+)$/)
      if (match) {
        setCountryCode(match[1])
        setLocalNumber(match[2])
      }
    }
  }, [value, localNumber])

  const handleLocalNumberChange = (newLocal: string) => {
    // Only allow digits and spaces
    const cleaned = newLocal.replace(/[^\d\s]/g, '')
    setLocalNumber(cleaned)
    onChange(`${countryCode}${cleaned.replace(/\s/g, '')}`)
  }

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode)
    onChange(`${newCode}${localNumber.replace(/\s/g, '')}`)
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => handleCountryCodeChange(e.target.value)}
          className="h-12 w-20 rounded-lg border border-slate-200 bg-white px-2 text-base text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 sm:h-14"
        >
          <option value="+92">+92</option>
          <option value="+1">+1</option>
          <option value="+44">+44</option>
          <option value="+91">+91</option>
          <option value="+971">+971</option>
          <option value="+966">+966</option>
        </select>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="300 1234567"
          value={localNumber}
          onChange={(e) => handleLocalNumberChange(e.target.value)}
          required={required}
          className="h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 sm:h-14"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Enter with country code (e.g. +92 300 1234567)
      </p>
    </div>
  )
}
