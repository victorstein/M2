import express, { json, Application } from 'express'
import config from '../config'
import helmet from 'helmet'
import enforce from 'express-sslify'
import { ContainerTypes, ILoader } from './types/loadersTypes'
import { Logger } from 'winston'
import compression from 'compression'
import { inject, injectable } from 'inversify'

@injectable()
class ExpressLoader implements ILoader<Application> {
  env: string
  app: Application

  @inject(ContainerTypes.LOGGER)
  logger: Logger

  constructor () {
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
        app.use(compression)
        app.disable('x-powered-by')
        app.use(enforce.HTTPS({ trustProtoHeader: true }))
      }

      this.logger.info('Express Initialized successfully ✅')

      return app
    } catch (e) {
      this.logger.error(`Error initializing Express: 💥 -> ${e.message as string}`)
      throw new Error(e)
    }
  }
}

export default ExpressLoader
