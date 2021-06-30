import express, { json, Application } from 'express'
import config from '../config'
import helmet from 'helmet'
import enforce from 'express-sslify'
import { Inject, Service } from 'typedi'
import { ContainerTypes, ILoader } from './types/loadersTypes'
import { Logger } from 'winston'

@Service()
class ExpressLoader implements ILoader {
  env: string
  app: Application

  constructor (
    @Inject(ContainerTypes.LOGGER) readonly logger: Logger
  ) {
    this.env = config.ENV
    this.app = express()
  }

  start (): Application {
    try {
      const app = express()

      // Basic security for production
      if (this.env === 'production') {
        app.use(helmet())
        app.use(json({ limit: '200kb' }))
        app.disable('x-powered-by')
        app.use(enforce.HTTPS({ trustProtoHeader: true }))
      }

      this.logger.info('Express Initialized successfully ✅')

      return app
    } catch (e) {
      this.logger.error('Error initializing Express: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}

export default ExpressLoader
