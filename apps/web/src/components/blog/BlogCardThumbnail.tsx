'use client'

import { useState } from 'react'

const PLACEHOLDER = '/blog-card-placeholder.svg'

type Props = {
  /** Resolved absolute URL, or null to show placeholder only */
  src: string | null
  title: string
}

/**
 * Plain `<img>` avoids Next/Image issues with SVG placeholders and arbitrary remote hosts.
 * Falls back to the placeholder if the post image fails (404, API down, bad URL, etc.).
 */
export function BlogCardThumbnail({ src, title }: Props) {
  const [failed, setFailed] = useState(false)
  const showPlaceholder = !src || failed
  const url = showPlaceholder ? PLACEHOLDER : src
  const alt = showPlaceholder ? '' : title

  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional: SVG + dynamic API uploads
    <img
      src={url}
      alt={alt}
      className={
        showPlaceholder
          ? 'absolute inset-0 h-full w-full object-cover object-center opacity-95'
          : 'absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]'
      }
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src && !failed) setFailed(true)
      }}
    />
  )
}
