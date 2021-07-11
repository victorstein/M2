import { EventSubscriber, On } from 'event-dispatch'
import logger from 'lib/logger'
import { Event, ISendTemporaryPasswordEmail } from './types/subscriberTypes'

@EventSubscriber()
export class EmailSubscriber {
  @On(Event.SEND_TEMPORARY_PASSWORD_EMAIL)
  onSendTemporaryEmail (data: ISendTemporaryPasswordEmail): void {
    logger.verbose(`Received event: ${Event.SEND_TEMPORARY_PASSWORD_EMAIL}. \n Data: ${JSON.stringify(data, null, 2)}`)
  }
}
