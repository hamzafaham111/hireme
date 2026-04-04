import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Photon (Komoot) reverse geocoder — works from servers without an API key.
 * OSM Nominatim returns 403 for many automated/server requests per their policy,
 * so we use Photon instead: https://photon.komoot.io
 */
type PhotonProperties = {
  name?: string
  street?: string
  city?: string
  town?: string
  village?: string
  district?: string
  locality?: string
  county?: string
  state?: string
  country?: string
}

type PhotonFeature = {
  properties?: PhotonProperties
}

type PhotonReverseJson = {
  features?: PhotonFeature[]
}

function labelFromPhotonProperties(p: PhotonProperties): string {
  const place =
    p.city ||
    p.town ||
    p.village ||
    p.district ||
    p.locality ||
    p.county ||
    p.name ||
    p.state ||
    ''
  const country = p.country || ''
  if (place && country) return `${place}, ${country}`
  if (country) return country
  if (place) return place
  return ''
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const latRaw = searchParams.get('lat')
  const lngRaw = searchParams.get('lng')
  const lat = latRaw != null ? Number(latRaw) : NaN
  const lng = lngRaw != null ? Number(lngRaw) : NaN

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return NextResponse.json({ error: 'Invalid lat or lng' }, { status: 400 })
  }

  const photonUrl = new URL('https://photon.komoot.io/reverse')
  photonUrl.searchParams.set('lat', String(lat))
  photonUrl.searchParams.set('lon', String(lng))

  let res: Response
  try {
    res = await fetch(photonUrl.toString(), {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json({ error: 'Geocoder unreachable' }, { status: 502 })
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `Geocoder error (${res.status})` },
      { status: 502 },
    )
  }

  let data: PhotonReverseJson
  try {
    data = (await res.json()) as PhotonReverseJson
  } catch {
    return NextResponse.json({ error: 'Invalid geocoder response' }, { status: 502 })
  }

  const props = data.features?.[0]?.properties
  if (!props) {
    return NextResponse.json(
      { error: 'No place found for these coordinates' },
      { status: 404 },
    )
  }

  const label = labelFromPhotonProperties(props)
  if (!label) {
    return NextResponse.json(
      { error: 'No place found for these coordinates' },
      { status: 404 },
    )
  }

  return NextResponse.json({ label, lat, lng })
}
