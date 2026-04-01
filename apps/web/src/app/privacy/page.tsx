import type { Metadata } from 'next'
import Link from 'next/link'
import { siteName } from '@/lib/site'
import { sectionHeadingClass } from '@/lib/typography'

export const metadata: Metadata = {
  title: 'Privacy',
  description: `Privacy information for ${siteName}.`,
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
        <Link href="/" className="hover:underline">
          ← Home
        </Link>
      </p>
      <h1 className={`mt-6 ${sectionHeadingClass}`}>Privacy</h1>
      <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        This is a placeholder page for the public marketing site. Replace with
        your real privacy policy before launch: what data you collect (e.g.
        WhatsApp messages, phone numbers), retention, partners, and user
        rights. {siteName} internal operations may use separate systems from
        this Next.js deployment.
      </p>
    </div>
  )
}
