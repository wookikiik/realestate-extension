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
