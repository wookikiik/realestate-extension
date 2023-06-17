import { MESSAGE_INJECT_RESOURCES, executeScript, useMessage } from '../share'

chrome.webRequest.onCompleted.addListener(
  details => {
    // 매물보기 버튼 클릭 여부
    if (details.url.indexOf('isClickedMarker') === -1) {
      return
    }

    // console.log('onCompleted', details)
    // chrome.runtime.sendMessage({ type: 'sample' })
  }, //
  {
    urls: ['https://new.land.naver.com/api/complexes/overview/*'],
  },
)

const message = useMessage()
{
  message.addEventListener(
    MESSAGE_INJECT_RESOURCES,
    (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: any) => void,
    ) => {
      executeScript(sender.tab?.id, message.resources).then(() =>
        sendResponse({
          type: MESSAGE_INJECT_RESOURCES,
          status: 'success',
        }),
      )
      return true
    },
  )
  message.openListener()
}
