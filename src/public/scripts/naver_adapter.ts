/**
 * This module is responsible for handling communication between the extension and Naver.
 * It loads the 'naver_adapter.js' script and listens for messages from Naver.
 * If a message is received requesting the app token, it sends the token back to Naver.
 * @module naver_adapter
 */
import {
  NAVER_MESSAGE_REQUEST_APP_TOKEN,
  NAVER_MESSAGE_SHARE_APP_TOKEN,
  MESSAGE_LOADED_SCRIPT,
  getNaverAppToken,
  useMessage,
} from '@/share'

const message = useMessage()
{
  message.sendPostMessage({ type: MESSAGE_LOADED_SCRIPT, script: 'naver_adapter.js' })

  // Received naver app token reuqest
  message.addEventListener(NAVER_MESSAGE_REQUEST_APP_TOKEN, () => {
    // Send naver app token
    message.sendPostMessage({
      type: NAVER_MESSAGE_SHARE_APP_TOKEN,
      token: getNaverAppToken(),
    })
  })
  message.openListener()
  window.addEventListener('unload', message.disconnect)
}
