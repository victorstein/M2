import { User } from '@sentry/node'
import { DocumentType } from '@typegoose/typegoose'
import { inject, injectable } from 'inversify'
import { EventSubscriber, On } from 'lib/decorators/EventSubscriber'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { EmailService } from 'services/emailService'
import { Logger } from 'winston'
import { Event } from './types/subscriberTypes'

@EventSubscriber()
@injectable()
export class EmailSubscriber {
  @inject(ContainerTypes.LOGGER) logger: Logger
  @inject(ContainerTypes.EMAIL_SERVICE) emailService: EmailService

  @On(Event.SEND_PASSWORD_RESET_EMAIL)
  async onSendTemporaryEmail (user: DocumentType<User>): Promise<void> {
    try {
      this.logger.verbose(`Received event: ${Event.SEND_PASSWORD_RESET_EMAIL}. \n Data: ${JSON.stringify(user, null, 2)}`)
      await this.emailService.sendResetPasswordEmail(user)
    } catch (e) {
      this.logger.error(`
        operation: onSendTemporaryEmail
        message: ${e.message as string}
      `)
    }
  }
}
