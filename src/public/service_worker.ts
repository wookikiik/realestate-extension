import { MESSAGE_INJECT_RESOURCES, executeScript } from '../share'

chrome.webRequest.onCompleted.addListener(
  details => {
    // 매물보기 버튼 클릭 여부
    if (details.url.indexOf('isClickedMarker') === -1) {
      return
    }

    console.log('onCompleted', details)
    chrome.runtime.sendMessage({ type: 'sample' })
  }, //
  {
    urls: ['https://new.land.naver.com/api/complexes/overview/*'],
  },
)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log('service_worker.ts onMessage', message)
  if (message.type === MESSAGE_INJECT_RESOURCES) {
    executeScript(sender.tab?.id, message.resources).then(() =>
      sendResponse({
        type: MESSAGE_INJECT_RESOURCES,
        status: 'success',
      }),
    )
    return true
  }
})
