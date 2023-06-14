import {
  NAVER_MESSAGE_ORIGIN,
  NAVER_MESSAGE_REQUEST_APP_TOKEN,
  NAVER_MESSAGE_SHARE_APP_TOKEN,
  MESSAGE_LOAD_SCRIPT,
  getNaverAppToken,
} from '@/share'

console.log(`[REUQEST-MESSAGE][${MESSAGE_LOAD_SCRIPT}]`)
window.postMessage(
  { type: MESSAGE_LOAD_SCRIPT, script: 'naver_adapter.js' },
  NAVER_MESSAGE_ORIGIN,
)

window.addEventListener('message', (event: MessageEvent) => {
  if (event.origin !== NAVER_MESSAGE_ORIGIN) return

  if (
    [NAVER_MESSAGE_REQUEST_APP_TOKEN, NAVER_MESSAGE_REQUEST_APP_TOKEN].includes(
      event.data.type,
    )
  ) {
    console.log(`[RESPONSE-MESSAGE][${event.data.type}]`)
  }

  if (event.data.type === NAVER_MESSAGE_REQUEST_APP_TOKEN) {
    console.log(`[REUQEST-MESSAGE][${NAVER_MESSAGE_SHARE_APP_TOKEN}]`)
    window.postMessage(
      {
        type: NAVER_MESSAGE_SHARE_APP_TOKEN,
        token: getNaverAppToken(),
      },
      NAVER_MESSAGE_ORIGIN,
    )
  }
})
