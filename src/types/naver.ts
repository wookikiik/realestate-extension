export {}
declare global {
  interface Window {
    App: {
      state: {
        token: {
          token: string
        }
      }
    }
  }
  const extensionID: string
}
