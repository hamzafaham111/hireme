import type { FC } from 'react'
import type { SiteService } from '@hire-me/types'
import {
  IconBankPaper,
  IconBriefcase,
  IconBulky,
  IconCar,
  IconCleaning,
  IconCooking,
  IconExpress,
  IconGift,
  IconGrocery,
  IconHomeKey,
  IconMessageSpark,
  IconPaw,
  IconPharmacy,
  IconQueue,
  IconRealEstate,
  IconShoppingBag,
  type SiteIconProps,
  IconTourGuide,
  IconTranslate,
  IconTutor,
} from './index'

/** Maps API `iconKey` to SVG components (aligned with `@hire-me/types` SITE_SERVICE_ICON_KEYS). */
export const SITE_SERVICE_ICON_REGISTRY: Record<string, FC<SiteIconProps>> = {
  express: IconExpress,
  'shopping-bag': IconShoppingBag,
  grocery: IconGrocery,
  cooking: IconCooking,
  pharmacy: IconPharmacy,
  'bank-paper': IconBankPaper,
  gift: IconGift,
  bulky: IconBulky,
  car: IconCar,
  queue: IconQueue,
  paw: IconPaw,
  'home-key': IconHomeKey,
  'real-estate': IconRealEstate,
  cleaning: IconCleaning,
  'tour-guide': IconTourGuide,
  translate: IconTranslate,
  tutor: IconTutor,
  briefcase: IconBriefcase,
  'message-spark': IconMessageSpark,
}

export function DefaultSiteServiceIcon(props: SiteIconProps) {
  return <IconMessageSpark {...props} />
}

export function SiteServiceIconVisual({
  service,
  className,
}: {
  service: Pick<SiteService, 'iconKey' | 'iconImageUrl'>
  className?: string
}) {
  if (service.iconImageUrl?.trim()) {
    return (
      <img
        src={service.iconImageUrl}
        alt=""
        className={className}
        loading="lazy"
        decoding="async"
      />
    )
  }
  const Icon = SITE_SERVICE_ICON_REGISTRY[service.iconKey] ?? DefaultSiteServiceIcon
  return <Icon className={className} />
}
