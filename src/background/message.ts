import {
  useMessageEvent,
  NAVER_MESSAGE_OPEN_PANEL_OVERVIEW,
  NaverRealEstate,
  waitLoadedTab,
} from '@/share'

export default () => {
  const message = useMessageEvent()
  message.addEventListener(
    NAVER_MESSAGE_OPEN_PANEL_OVERVIEW,
    async (
      message: any,
      _: chrome.runtime.MessageSender,
      sendResponse: (response: any) => void,
    ) => {
      ;(async () => {
        const { tabId } = await waitLoadedTab()
        await chrome.sidePanel.setOptions({
          tabId,
          path: 'overview.html',
          enabled: true,
        })
        sendResponse(true)
      })()
      return true
    },
  )
  message.openListener()
}
