import {
  NAVER_MESSAGE_REQUEST_APP_TOKEN,
  NAVER_MESSAGE_SHARE_APP_TOKEN,
  MESSAGE_LOADED_SCRIPT,
  loadScript,
  useMessage,
  setLocalValue,
} from '@/share'

loadScript('naver_adapter.js')

const message = useMessage()
{
  // Received load script
  message.addEventListener(MESSAGE_LOADED_SCRIPT, () => {
    message.sendPostMessage({
      type: NAVER_MESSAGE_REQUEST_APP_TOKEN,
    })
  })

  // Received naver app token
  message.addEventListener(NAVER_MESSAGE_SHARE_APP_TOKEN, async (data: any) => {
    await setLocalValue(data.token)
  })

  message.openListener()
  window.addEventListener('unload', message.disconnect)
}
