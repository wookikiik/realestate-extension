import { InjectResourcesMessage, MessageRequest, MessageResponse } from '@/types'
import { MESSAGE_INJECT_RESOURCES } from './constants'

export async function loadResources(site: string, resources: string[]) {
  const response = await chrome.runtime.sendMessage<
    MessageRequest<InjectResourcesMessage>,
    MessageResponse
  >({
    site,
    type: MESSAGE_INJECT_RESOURCES,
    resources,
  })

  console.log(response)
}
