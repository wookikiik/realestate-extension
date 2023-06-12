import { MESSAGE_INJECT_RESOURCES } from '@/share/messageConstants'
import { MessageRequest, MessageResponse, InjectResourcesMessage } from '@/types'
;(async () => {
  const { message, state, type } = await chrome.runtime.sendMessage<
    MessageRequest<InjectResourcesMessage>,
    MessageResponse<{ message: string }>
  >({
    type: MESSAGE_INJECT_RESOURCES,
    resources: ['web-resource.js'],
  })

  console.log(type, state, message)
})()
