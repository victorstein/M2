import { Application } from 'express'
import { Service } from 'typedi'
import ApolloLoader from 'loaders/apolloLoader'
import ContainerLoader from './containerLoader'
import ExpressLoader from './expressLoader'
import logger from 'lib/logger'

@Service()
class Loaders {
  constructor (
    private readonly apollo: ApolloLoader,
    private readonly container: ContainerLoader,
    private readonly express: ExpressLoader
  ) {}

  async load (): Promise<Application> {
    try {
      // Start the container
      this.container.start()

      // Start the Apollo Instance
      await this.apollo.start()

      return this.express.app
    } catch (e) {
      logger.error('Error initializing Loaders 💥')
      throw new Error(e.message)
    }
  }
}

export default Loaders
