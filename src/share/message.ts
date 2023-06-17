import { NAVER_MESSAGE_ORIGIN } from '@/share'

export const useMessage = () => {
  const windowInstance = typeof window !== 'undefined' ? window : undefined
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

  function openListener() {
    if (windowInstance) {
      windowInstance.addEventListener('message', windowMessageListenner)
    }

    chrome.runtime.onMessage?.addListener(chromeMessageListenner)
  }

  function sendPostMessage(message: any) {
    if (windowInstance) {
      console.log(`[WINDOW][REUQEST-MESSAGE][${message.type}]`)
      windowInstance.postMessage(message, NAVER_MESSAGE_ORIGIN)
    }
  }

  function sendChromeMessage(message: any): Promise<any> {
    console.log(`[CHROME][REUQEST-MESSAGE][${message.type}]`)
    return chrome.runtime.sendMessage(message)
  }

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
    openListener,
    addEventListener,
    removeEventListener,
    disconnect,
  }
}
