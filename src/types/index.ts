export type InjectResourcesMessage = {
  readonly resources: string[]
}

export type MessageRequest<T> = {
  type: string
} & T

export type MessageResponse<T = unknown> = {
  type: string
  state: 'success' | 'error'
} & T
