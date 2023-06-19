import { NAVER_MESSAGE_ORIGIN, waitLoadedTab } from '@/share'

const useMessage = () => {
  const dispatchs: Map<string, any> = new Map()

  const windowMessageListenner = (event: MessageEvent) => {
    if (event.origin !== NAVER_MESSAGE_ORIGIN) return
    for (const [type, callback] of dispatchs) {
      if (type === event.data.type) {
        console.log(`[WINDOW][RESPONSE-MESSAGE][${type}]`)
        callback(event.data)
      }
    }
  }

  const chromeMessageListenner = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void,
  ) => {
    for (const [type, callback] of dispatchs) {
      if (type === message.type) {
        console.log(`[CHROME][RESPONSE-MESSAGE][${type}]`)
        return callback(message, sender, sendResponse)
      }
    }
  }

  return {
    dispatchs,
    windowMessageListenner,
    chromeMessageListenner,
  }
}

const {
  dispatchs, //
  windowMessageListenner,
  chromeMessageListenner,
} = useMessage()

export const useMessageEvent = () => {
  const windowInstance = typeof window !== 'undefined' ? window : undefined

  function openListener() {
    if (windowInstance) {
      windowInstance.addEventListener('message', windowMessageListenner)
    }

    chrome.runtime.onMessage?.addListener(chromeMessageListenner)
  }

  function sendPostMessage(message: any): void {
    if (windowInstance) {
      console.log(`[WINDOW][REUQEST-MESSAGE][${message.type}]`)
      windowInstance.postMessage(message, NAVER_MESSAGE_ORIGIN)
    }
  }

  async function sendChromeMessage(message: any): Promise<any> {
    console.log(`[CHROME][REUQEST-MESSAGE][${message.type}]`)
    return chrome.runtime.sendMessage(message)
  }

  async function sendChromdActiveTabMessage(message: any): Promise<any> {
    const { tabId } = await waitLoadedTab()
    console.log(`[CHROME-${tabId}][REUQEST-MESSAGE][${message.type}]`)
    return chrome.tabs.sendMessage(tabId, message)
  }

  // waitLoadedTab
  function addEventListener(type: string, callback: any) {
    dispatchs.set(type, callback)
  }

  function removeEventListener(type: string) {
    dispatchs.delete(type)
  }

  function disconnect() {
    if (windowInstance) {
      windowInstance.removeEventListener('message', windowMessageListenner)
    }

    chrome.runtime.onMessage?.removeListener(chromeMessageListenner)
  }
  return {
    sendPostMessage,
    sendChromeMessage,
    sendChromdActiveTabMessage,
    openListener,
    addEventListener,
    removeEventListener,
    disconnect,
  }
}
