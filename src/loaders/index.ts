import { Application } from 'express'
import { Service } from 'typedi'
import ApolloLoader from 'loaders/apolloLoader'
import ContainerLoader from './containerLoader'
import ExpressLoader from './expressLoader'

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
      throw new Error(`There was an error initializing your loaders 💥 -> ${e.message as string}`)
    }
  }
}

export default Loaders
