import express, { json, Application } from 'express'
import config from '../config'
import helmet from 'helmet'
import enforce from 'express-sslify'
import { Service } from 'typedi'

@Service()
class ExpressLoader {
  env: string
  app: Application

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
        app.disable('x-powered-by')
        app.use(enforce.HTTPS({ trustProtoHeader: true }))
      }

      console.log('Express Initialized successfully ✅')

      return app
    } catch (e) {
      console.log('Error initializing Express: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}

export default ExpressLoader
