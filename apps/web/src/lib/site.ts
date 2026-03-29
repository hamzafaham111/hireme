/**
 * Public marketing site config. Override via env when deploying.
 */
export const siteName = 'Hire Me'

export const siteTagline =
  'Errands, deliveries, and help on WhatsApp—whatever you need, just message us.'

/** E.164 digits only, no + prefix */
export function getWhatsAppE164(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? '923169650686'
}

export function getWhatsAppPrefill(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_PREFILL ??
    encodeURIComponent(`Hi ${siteName}, I'd like to request a service.`)
  )
}

export function whatsappHref(): string {
  const phone = getWhatsAppE164().replace(/\D/g, '')
  const text = getWhatsAppPrefill()
  return `https://wa.me/${phone}?text=${text}`
}
