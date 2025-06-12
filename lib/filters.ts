export function updateFilters(newFilters: Record<string, string>) {
  const url = new URL(window.location.href)

  Object.entries(newFilters).forEach(([key, value]) => {
    if (value && value !== "all") {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
  })

  window.history.pushState({}, "", url.toString())
  return url.searchParams.toString()
}

export function getFilterValue(key: string, defaultValue = ""): string {
  if (typeof window === "undefined") return defaultValue

  const url = new URL(window.location.href)
  return url.searchParams.get(key) || defaultValue
}

export function clearAllFilters() {
  const url = new URL(window.location.href)
  url.search = ""
  window.history.pushState({}, "", url.toString())
}
