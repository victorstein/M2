import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Transporter } from 'nodemailer'
import { Logger } from 'winston'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { EmailReplaceTypes, EmailTypes } from 'lib/emailTemplates/types/emailTypes'
import config from 'config'
import { UserService } from './userService'
import jwt from 'jsonwebtoken'
import { DocumentType } from '@typegoose/typegoose'
import { User } from '@sentry/node'
import { MailOptions } from 'nodemailer/lib/json-transport'

@injectable()
export class EmailService {
  @inject(ContainerTypes.LOGGER) logger: Logger
  @inject(ContainerTypes.EMAIL_TRANSPORT) transport: Transporter
  @inject(ContainerTypes.USER_SERVICE) userService: UserService

  loadHTML (filename: EmailTypes): string {
    return readFileSync(resolve(__dirname, '../lib/emailTemplates', filename)).toString()
  }

  async sendEmail (config: MailOptions): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.transport.sendMail(config, (err, info) => {
        if (err !== null) return reject(err)
        this.logger.verbose(JSON.stringify(info, null, 2))
        resolve()
      })
    })
  }

  async sendResetPasswordEmail (user: DocumentType<User>): Promise<void> {
    try {
      let template = this.loadHTML(EmailTypes.RESET_PASSWORD)

      this.logger.verbose('Generating the URL hash...')
      const hash = jwt.sign({ id: user._id }, config.EMAIL_SECRET ?? '', { expiresIn: config.EMAIL_PASSWORD_REQUEST_EXP })

      // Replace all required instances
      template = template.replace(EmailReplaceTypes.FULL_NAME, user.fullName)
      template = template.replace(EmailReplaceTypes.RESET_LINK, `${config.DOMAIN_URL}?meta=${hash}`)

      await this.sendEmail({
        from: config.EMAIL_PROVIDER_USER ?? '',
        to: user.email,
        subject: 'Password reset',
        html: template
      })

      this.logger.verbose('Email sent successfully')
    } catch ({ message }) {
      this.logger.error(`Error sending reset password email. ${message as string}`)
      throw new Error(message)
    }
  }
}
