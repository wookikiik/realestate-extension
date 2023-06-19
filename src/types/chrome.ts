/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace chrome {
    namespace sidePanel {
      type OptionPrams = { tabId: number; path?: string; enabled: boolean }
      function setOptions(params: OptionPrams): Promise<void>
    }
  }
}

export type InjectResourcesMessage = {
  readonly resources: string[]
}

export type MessageRequest<T = unknown> = {
  type: string
  site: string
} & T

export type MessageResponse<T = unknown> = {
  type: string
  site: string
  state?: 'success' | 'error'
} & T

export type NaverMessageReqeust = InjectResourcesMessage
export type NaverMessageResponse = unknown
