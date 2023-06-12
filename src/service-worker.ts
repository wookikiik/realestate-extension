import { MESSAGE_INJECT_RESOURCES } from '@/share/messageConstants'
import { MessageResponse, InjectResourcesMessage } from '@/types'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MESSAGE_INJECT_RESOURCES) {
    return onInjectResources(message, sender, sendResponse)
  }
})

function onInjectResources(
  message: InjectResourcesMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: MessageResponse<{ message: string }>) => void,
): void | boolean {
  const tabId = sender.tab?.id
  if (tabId === undefined) {
    sendResponse({
      type: MESSAGE_INJECT_RESOURCES,
      state: 'error',
      message: 'tabId is undefined',
    })

    return
  }

  // async function return true
  chrome.scripting
    .executeScript({
      target: { tabId },
      files: message.resources,
    })
    .then(() => {
      sendResponse({
        type: MESSAGE_INJECT_RESOURCES,
        state: 'success',
        message: 'injected resources',
      })
    })

  return true
}
