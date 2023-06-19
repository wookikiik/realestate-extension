import {
  NAVER_MESSAGE_REQUEST_APP_TOKEN,
  NAVER_MESSAGE_SHARE_APP_TOKEN,
  NAVER_MESSAGE_LOADED_COMPLEX,
  MESSAGE_LOADED_SCRIPT,
  useMessageEvent,
  setLocalValue,
} from '@/share'
import { showStandardArticles } from './complex'

export default () => {
  const message = useMessageEvent()

  // Received load script
  message.addEventListener(MESSAGE_LOADED_SCRIPT, () => {
    message.sendPostMessage({
      type: NAVER_MESSAGE_REQUEST_APP_TOKEN,
    })
  })

  // Received naver app token
  message.addEventListener(NAVER_MESSAGE_SHARE_APP_TOKEN, async (data: any) => {
    await setLocalValue({ token: data.token })
  })

  // Received complex no
  message.addEventListener(
    NAVER_MESSAGE_LOADED_COMPLEX,
    (
      message: any,
      _: chrome.runtime.MessageSender,
      sendResponse: (response: any) => void,
    ) => {
      // console.log('loaded complex no: ', message.complexNo)

      ;(async () => {
        try {
          await showStandardArticles(message.complexNo)
          sendResponse(true)
        } catch (e) {
          sendResponse(false)
        }
      })()

      return true
    },
  )

  message.openListener()
  window.addEventListener('unload', message.disconnect)
}
