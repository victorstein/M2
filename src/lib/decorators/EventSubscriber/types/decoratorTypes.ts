export type Constructor = new (...args: any[]) => {}

export interface EventSubscriberMetadata {
  event: string | string[]
  methodName: string
}
