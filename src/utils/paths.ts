export type Locale = 'en' | 'ar'

export interface Localized {
  en: string
  ar: string
}

/**
 * Joins an internal site path with Astro's configured BASE_URL safely,
 * avoiding double slashes across both root ('/') and subpath deployments.
 */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path
  const rawBase = import.meta.env.BASE_URL || '/'
  const cleanBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

/**
 * Routes that have a 1:1 Arabic mirror under /ar/...
 * English-only case studies fall back to /ar/work/ when switching to Arabic.
 */
const ARABIC_CASE_STUDY_SLUGS = new Set(['hawyati', 'magic-linker'])

export function stripBase(pathname: string): string {
  const rawBase = import.meta.env.BASE_URL || '/'
  const cleanBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase
  if (cleanBase && pathname.startsWith(cleanBase)) {
    const rest = pathname.slice(cleanBase.length)
    return rest.startsWith('/') ? rest : `/${rest}`
  }
  return pathname
}

export function getLocaleSwitchUrl(currentPathname: string, target: Locale): string {
  const rel = stripBase(currentPathname)
  const normalized = rel.endsWith('/') ? rel : `${rel}/`

  if (target === 'en') {
    if (normalized === '/ar/') return withBase('/')
    if (normalized.startsWith('/ar/')) return withBase(normalized.slice(3))
    return withBase(normalized)
  }

  // Switching to Arabic
  if (normalized.startsWith('/ar/')) return withBase(normalized)
  if (normalized === '/' || normalized.startsWith('/404')) return withBase('/ar/')
  if (normalized.startsWith('/lab/')) return withBase('/ar/')

  const workMatch = normalized.match(/^\/work\/([^/]+)\/$/)
  if (workMatch) {
    const slug = workMatch[1]
    return ARABIC_CASE_STUDY_SLUGS.has(slug)
      ? withBase(`/ar/work/${slug}/`)
      : withBase('/ar/work/')
  }

  return withBase(`/ar${normalized}`)
}
