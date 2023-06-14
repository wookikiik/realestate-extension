import {
  NAVER_MESSAGE_REQUEST_APP_TOKEN,
  NAVER_MESSAGE_SHARE_APP_TOKEN,
  NAVER_MESSAGE_ORIGIN,
  MESSAGE_LOAD_SCRIPT,
  loadScript,
} from '@/share'

window.addEventListener('message', (event: MessageEvent) => {
  if (event.origin !== NAVER_MESSAGE_ORIGIN) return

  if ([MESSAGE_LOAD_SCRIPT, NAVER_MESSAGE_SHARE_APP_TOKEN].includes(event.data.type)) {
    console.log(`[RESPONSE-MESSAGE][${event.data.type}]`)
  }

  // Load script
  if (event.data.type === MESSAGE_LOAD_SCRIPT) {
    if (event.data.script === 'naverAdapter.js') {
      console.log(`[REUQEST-MESSAGE][${NAVER_MESSAGE_REQUEST_APP_TOKEN}]`)
      window.postMessage({
        type: NAVER_MESSAGE_REQUEST_APP_TOKEN,
      })
    }
  }
  // Get naver app token
  else if (event.data.type === NAVER_MESSAGE_SHARE_APP_TOKEN) {
    console.log('Get naver app token: ', event.data.token)
  }
})

loadScript('naverAdapter.js')
