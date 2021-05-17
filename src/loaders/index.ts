import { Application } from 'express'
import { Service } from 'typedi'
import ApolloLoader from 'loaders/apolloLoader'
import ContainerLoader from './containerLoader'

@Service()
class Loaders {
  constructor (
    private readonly apollo: ApolloLoader,
    private readonly container: ContainerLoader
  ) {}

  async load (): Promise<Application> {
    try {
      // Start the container
      this.container.start()

      // Start the Apollo Instance
      const app = await this.apollo.start()

      return app
    } catch (e) {
      throw new Error(`There was an error initializing your loaders 💥 -> ${e.message as string}`)
    }
  }
}

export default Loaders
