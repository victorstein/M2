import config from 'config'
import { inject, injectable } from 'inversify'
import nodemailer, { Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { Logger } from 'winston'
import containerLoader from './containerLoader'
import { ContainerTypes, ILoader } from './types/loadersTypes'

@injectable()
export class EmailLoader implements ILoader<Promise<Transporter>> {
  @inject(ContainerTypes.LOGGER) logger: Logger
  transport: Transporter

  async start (): Promise<Transporter> {
    try {
      const user = config.EMAIL_PROVIDER_USER
      const pass = config.EMAIL_PROVIDER_PASS
      const secret = config.EMAIL_SECRET

      // Check for needed variables to run SMTP connection
      if (user === null || pass === null) {
        throw new Error('SMTP Email or password missing. Please check your env file.')
      }

      // Check for needed variables to create emails
      if (secret === null) {
        throw new Error('Email secret is not set. Please check your env file')
      }

      const options: SMTPTransport.Options = {
        host: config.EMAIL_PROVIDER_HOST,
        port: config.ENV === 'production' ? config.EMAIL_PROVIDER_SSL_PORT : config.EMAIL_PROVIDER_TLS_PORT,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
      }

      const transporter = nodemailer.createTransport(options)
      // verify transport
      await transporter.verify()

      this.logger.info('Email Transport Initialized successfully ✅')
      // Add email transporter to the container
      containerLoader.bind(ContainerTypes.EMAIL_TRANSPORT).toConstantValue(transporter)
      return transporter
    } catch (e) {
      this.logger.error('Error initializing Email Transport: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}
