import { Application } from 'express'
import { Service } from 'typedi'
import ApolloLoader from 'loaders/apolloLoader'
import SentryLoader from 'loaders/sentryLoader'

@Service()
class Loaders {
  constructor (
    private readonly sentry: SentryLoader,
    private readonly apollo: ApolloLoader
  ) {}

  async load (): Promise<Application> {
    try {
      // Start Sentry
      this.sentry.start()

      // Start the Apollo Instance
      const app = await this.apollo.start()

      return app
    } catch (e) {
      throw new Error(`There was an error initializing your loaders 💥 -> ${e.message as string}`)
    }
  }
}

export default Loaders
