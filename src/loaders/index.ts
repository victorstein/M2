import { Application } from 'express'
import { Service } from 'typedi'
import ApolloLoader from './apolloLoader'
import SentryLoader from './sentryLoader'

@Service()
class Loaders {
  constructor (
    private sentry: SentryLoader,
    private apollo: ApolloLoader
  ) {}

  async load (): Promise<Application> {
    try {
      // Start Sentry
      this.sentry.start()

      // Start the Apollo Instance
      const app = await this.apollo.start()

      return app
    } catch (e) {
      throw new Error(`There was an error initializing your loaders 💥 -> ${e.message}`)
    }
  }
}

export default Loaders