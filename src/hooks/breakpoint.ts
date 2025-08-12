import * as React from 'react'

interface MqlLegacy {
  addListener(cb: (e: MediaQueryListEvent) => void): void
  removeListener(cb: (e: MediaQueryListEvent) => void): void
}

type UseMQOptions = {
  defaultMatches?: boolean

  legacySupport?: boolean
}

export function useMediaQuery(query: string, options: UseMQOptions = {}) {
  const { defaultMatches = false, legacySupport = true } = options

  const [matches, setMatches] = React.useState<boolean>(defaultMatches)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)

    if ('addEventListener' in mql) {
      mql.addEventListener('change', onChange as EventListener)
      return () => mql.removeEventListener('change', onChange as EventListener)
    }

    if (legacySupport) {
      const legacy = mql as unknown as MqlLegacy
      legacy.addListener(onChange)
      return () => legacy.removeListener(onChange)
    }

    return
  }, [query, legacySupport])

  return matches
}
export const bp = { sm: 640, md: 768, lg: 1024, xl: 1280 }

export function useBreakpoint(defaults?: {
  sm?: boolean
  md?: boolean
  lg?: boolean
  xl?: boolean
}) {
  const isSmUp = useMediaQuery(`(min-width: ${bp.sm}px)`, {
    defaultMatches: defaults?.sm ?? false,
  })
  const isMdUp = useMediaQuery(`(min-width: ${bp.md}px)`, {
    defaultMatches: defaults?.md ?? false,
  })
  const isLgUp = useMediaQuery(`(min-width: ${bp.lg}px)`, {
    defaultMatches: defaults?.lg ?? false,
  })
  const isXlUp = useMediaQuery(`(min-width: ${bp.xl}px)`, {
    defaultMatches: defaults?.xl ?? false,
  })
  return { isSmUp, isMdUp, isLgUp, isXlUp }
}

export function useBreakpointValue<T>(
  values: { base: T; sm?: T; md?: T; lg?: T; xl?: T },
  defaults?: { sm?: boolean; md?: boolean; lg?: boolean; xl?: boolean },
): T {
  const { isSmUp, isMdUp, isLgUp, isXlUp } = useBreakpoint(defaults)
  if (isXlUp && values.xl !== undefined) return values.xl
  if (isLgUp && values.lg !== undefined) return values.lg
  if (isMdUp && values.md !== undefined) return values.md
  if (isSmUp && values.sm !== undefined) return values.sm
  return values.base
}
