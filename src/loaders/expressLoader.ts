import express, { json, Application } from 'express'
import config from '../config'
import helmet from 'helmet'
import enforce from 'express-sslify'
import { Service } from 'typedi'
import LoaderBase from './loaderBase'

@Service()
class ExpressLoader extends LoaderBase {
  env: string
  app: Application

  constructor () {
    super()
    this.env = config.ENV
  }

  start (): void {
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

      this.app = app
    } catch (e) {
      this.logger.error('Error initializing Express: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}

export default ExpressLoader
