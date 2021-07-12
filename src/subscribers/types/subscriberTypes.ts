export enum Event {
  SEND_PASSWORD_RESET_EMAIL = 'SEND_PASSWORD_RESET_EMAIL'
}

export interface EventDispatcher {
  dispatch: <T>(eventNames: Event | Event[], data?: T) => void
}
