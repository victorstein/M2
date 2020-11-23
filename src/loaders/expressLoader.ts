import express, { json, Application } from 'express'
import config from 'config'
import helmet from 'helmet'
import enforce from 'express-sslify'
import { Service } from 'typedi'

@Service()
export default class ExpressLoader {
  env: string
  app: Application

  constructor () {
    this.app = express()
  }

  start (): Application {
    try {
      // Basic security for production
      if (config.ENV === 'production') {
        this.app.use(helmet())
        this.app.use(json({ limit: '200kb' }))
        this.app.disable('x-powered-by')
        this.app.use(enforce.HTTPS({ trustProtoHeader: true }))
      }

      console.log('Express Initialized successfully ✅')

      return this.app
    } catch (e) {
      console.log('Error initializing Express: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}
