import { Application } from 'express'
import apolloLoader from './apolloLoader'
import expressLoader from './expressLoader'
import sentryLoader from './sentryLoader'

class Loaders {
  // Loaders
  apollo: any
  express: any
  sentry: any

  constructor () {
    this.apollo = apolloLoader
    this.express = expressLoader
    this.sentry = sentryLoader
  }

  async load (): Promise<Application> {
    try {
      // Start Sentry
      this.sentry()

      // Start the express server
      const app = this.express()

      // Start the apollo instance
      await this.apollo(app)

      return app
    } catch (e) {
      console.log(e.message)
      throw new Error('There was an error initializing your loaders 💥')
    }
  }
}

const initializedLoaders = new Loaders()

export default initializedLoaders