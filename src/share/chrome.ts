export const onceReviceTabStatus = (status: string): Promise<chrome.tabs.Tab> => {
  return new Promise(resolve => {
    const listener = (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => {
      if (changeInfo.status === status) {
        chrome.tabs.onUpdated.removeListener(listener)
        resolve(tab)
      }
    }

    chrome.tabs.onUpdated.addListener(listener)
  })
}

export const loadScript = (scriptName: string) => {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL(scriptName)
  ;(document.head || document.documentElement).appendChild(script)
}

export async function executeScript(tabId: number | undefined, files: string[]) {
  if (!tabId) {
    console.warn('tabId is undefined')
    return
  }
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    files,
  })

  console.log('loadResource', result)
}
