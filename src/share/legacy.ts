export function getNaverAppToken(): string | undefined {
  try {
    return window.App.state.token.token
  } catch (e) {
    console.warn('Fail get app token.', e)
    return undefined
  }
}

export function getNaverComplexNo(href: string): string | undefined {
  const pattern = /https:\/\/new\.land\.naver\.com\/(.*\/)?complexes(\/\w+)*\/(\d+)/
  const match = href.match(pattern)
  return match ? match[3] : undefined
}
