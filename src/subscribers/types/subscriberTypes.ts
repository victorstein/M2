import User from 'db/models/user'

export enum Event {
  SEND_TEMPORARY_PASSWORD_EMAIL = 'SEND_TEMPORARY_PASSWORD_EMAIL'
}

export interface EventDispatcher {
  dispatch: <T>(eventNames: Event | Event[], data?: T) => void
}

export interface ISendTemporaryPasswordEmail {
  user: Partial<User>
  temporaryPassword: string
}
