export function getNaverAppToken(): string | undefined {
  try {
    return window.App.state.token.token
  } catch (e) {
    console.warn('Fail get app token.', e)
    return undefined
  }
}
