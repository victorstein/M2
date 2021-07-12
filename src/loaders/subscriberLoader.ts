import { inject, injectable } from 'inversify'
import { EmailSubscriber } from 'subscribers/emailSubscriber'
import { Logger } from 'winston'
import containerLoader from './containerLoader'
import { ContainerTypes, ILoader } from './types/loadersTypes'

@injectable()
export class SubscriberLoader implements ILoader<void> {
  @inject(ContainerTypes.LOGGER) logger: Logger

  start (): void {
    try {
      containerLoader.get(EmailSubscriber)
    } catch ({ message }) {
      this.logger.error(`Error initializing Subscribers: 💥 -> ${message as string}`)
      throw new Error(message)
    }
  }
}
