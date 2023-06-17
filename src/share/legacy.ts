export function getNaverAppToken(): string | undefined {
  try {
    return window.App.state.token.token
  } catch (e) {
    console.warn('Fail get app token.', e)
    return undefined
  }
}

export function getNaverComplexNo(): string | undefined {
  const match = window.location.href.match(/\/complexes\/(\d+)/)
  if (match) {
    return match[1]
  }
  return undefined
}
