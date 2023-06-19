import { NAVER_MESSAGE_LOADED_COMPLEX, getNaverComplexNo, useMessageEvent } from '@/share'
import loadMessageEvent from './message'

loadMessageEvent()

const { sendChromdActiveTabMessage } = useMessageEvent()
chrome.webRequest.onCompleted.addListener(
  details => {
    // [매물보기] 버튼 클릭
    if (details.url.indexOf('isClickedMarker') === -1) {
      return
    }
    ;(async () => {
      await sendChromdActiveTabMessage({
        type: NAVER_MESSAGE_LOADED_COMPLEX,
        complexNo: getNaverComplexNo(details.url),
      })
    })()
  }, //
  {
    urls: ['https://new.land.naver.com/api/complexes/overview/*'],
  },
)
