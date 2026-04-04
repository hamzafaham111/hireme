'use client'

import { useCallback, useEffect, useState } from 'react'
import { siteLocationUnsetLabel } from '@/lib/site'
import {
  readStoredUserLocation,
  writeStoredUserLocation,
} from '@/lib/user-location'

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const unsetRowBtn =
  'flex min-w-0 max-w-full items-center gap-2 rounded-lg text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800/80'

const linkBtn =
  'shrink-0 text-xs font-semibold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-400 dark:hover:text-brand-300'

/**
 * No default city — user must opt in. Unset row is one tap; after that, label + “Change location”.
 */
export function HeaderServiceLocation() {
  const [label, setLabel] = useState(siteLocationUnsetLabel)
  const [hasChosenLocation, setHasChosenLocation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = readStoredUserLocation()
    if (stored?.label) {
      setLabel(stored.label)
      setHasChosenLocation(true)
    }
  }, [])

  const requestLocation = useCallback(() => {
    setError(null)
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Location is not supported in this browser.')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `/api/reverse-geocode?lat=${encodeURIComponent(String(latitude))}&lng=${encodeURIComponent(String(longitude))}`,
          )
          const data = (await res.json()) as { label?: string; error?: string }
          if (!res.ok) {
            throw new Error(data.error || 'Could not resolve address')
          }
          if (!data.label) throw new Error('No address returned')
          writeStoredUserLocation({
            lat: latitude,
            lng: longitude,
            label: data.label,
            updatedAt: new Date().toISOString(),
          })
          setLabel(data.label)
          setHasChosenLocation(true)
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Something went wrong')
        } finally {
          setLoading(false)
        }
      },
      (geoErr) => {
        setLoading(false)
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError(
            'Location permission denied. You can allow it in your browser settings and try again.',
          )
        } else if (geoErr.code === geoErr.TIMEOUT) {
          setError('Location request timed out. Try again.')
        } else {
          setError('Could not read your location.')
        }
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300_000,
        timeout: 15_000,
      },
    )
  }, [])

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[min(100%,18rem)] sm:flex-none">
      {!hasChosenLocation ? (
        <button
          type="button"
          className={unsetRowBtn}
          onClick={requestLocation}
          disabled={loading}
          aria-busy={loading}
          aria-label={loading ? 'Getting your location' : 'Set your area using your device location'}
        >
          <MapPinIcon className="size-5 shrink-0 text-brand-600 dark:text-brand-400" />
          <span className="min-w-0 truncate">
            {loading ? 'Getting location…' : siteLocationUnsetLabel}
          </span>
        </button>
      ) : (
        <>
          <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <MapPinIcon className="size-5 shrink-0 text-brand-600 dark:text-brand-400" />
            <span className="sr-only">Your area: </span>
            <span className="min-w-0 truncate" title={label}>
              {label}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-7 sm:pl-0">
            <button
              type="button"
              className={linkBtn}
              onClick={requestLocation}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Updating…' : 'Change location'}
            </button>
            {error ? (
              <span className="text-xs text-amber-700 dark:text-amber-400" role="status">
                {error}
              </span>
            ) : null}
          </div>
        </>
      )}

      {!hasChosenLocation && error ? (
        <div className="pl-0 sm:pl-0">
          <span className="text-xs text-amber-700 dark:text-amber-400" role="status">
            {error}
          </span>
        </div>
      ) : null}
    </div>
  )
}
