# Hire Me — public website

Customer-facing marketing site: **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS** — aligned with the main dashboard stack (React + TS + Tailwind) but optimized for SEO and static deployment.

## Run locally

From the **monorepo root** (recommended):

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
```

Or from this folder after root `npm install`:

```bash
cd apps/web
cp .env.example .env.local
# Set NEXT_PUBLIC_WHATSAPP_E164 to your WhatsApp Business number (digits only, e.g. 923169650686)

npm run dev --workspace=@hire-me/web
```

Open [http://localhost:3000](http://localhost:3000).

## Build and production

```bash
npm run build --workspace=@hire-me/web
npm run start --workspace=@hire-me/web
```

Deploy **`apps/web`** as its own project (e.g. Vercel root directory `apps/web`). It does not depend on the dashboard except the shared monorepo install.

## Content

- Hero, stats, WhatsApp explainer, services grid, how-it-works, partners, testimonials, why-us, FAQ, final CTA.
- Copy is inspired by concierge-style sites (e.g. Taskerz) but written for **Hire Me** — replace with your final brand/legal text.
- Partner tiles are placeholders until you add real logos (`public/` + `next/image`).

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_WHATSAPP_E164` | WhatsApp number for `wa.me` links (no `+`) |
| `NEXT_PUBLIC_WHATSAPP_PREFILL` | Optional URL-encoded default message |
| `NEXT_PUBLIC_LOCATION_UNSET_LABEL` | Optional header prompt before the user sets an area (default: “Set your area”) |
