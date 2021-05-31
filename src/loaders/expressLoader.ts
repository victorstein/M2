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
    this.app = express()
  }

  start (): void {
    try {
      // Basic security for production
      if (this.env === 'production') {
        this.app.use(helmet())
        this.app.use(json({ limit: '200kb' }))
        this.app.disable('x-powered-by')
        this.app.use(enforce.HTTPS({ trustProtoHeader: true }))
      }

      this.logger.info('Express Initialized successfully ✅')
    } catch (e) {
      this.logger.error('Error initializing Express 💥')
      throw new Error(e.message)
    }
  }
}

export default ExpressLoader
