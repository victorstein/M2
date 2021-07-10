import config from 'config'
import { Application } from 'express'
import { inject, injectable } from 'inversify'
import { ContainerTypes, ILoader, LoaderTypes } from './types/loadersTypes'
@injectable()
class Loaders {
  constructor (
    @inject(ContainerTypes.EXPRESS_LOADER) private readonly express: ILoader<LoaderTypes.EXPRESS>,
    @inject(ContainerTypes.APOLLO_LOADER) private readonly apollo: ILoader<LoaderTypes.APOLLO>,
    @inject(ContainerTypes.MONGO_LOADER) private readonly mongo: ILoader<LoaderTypes.VOID>
  ) {}

  async load (): Promise<Application> {
    try {
      // Create express app
      const app = this.express.start()

      // Connect to the DB
      await this.mongo.start()

      // Start the Apollo Instance
      const server = await this.apollo.start()

      // Apply the express app to the apollo server
      server.applyMiddleware({
        app,
        cors: {
          credentials: true,
          origin: config.ENV === 'production' ? config.ALLOWED_ORIGINS : '*'
        }
      })

      return app
    } catch (e) {
      throw new Error(`There was an error initializing your loaders 💥 -> ${e.message as string}`)
    }
  }
}

export default Loaders
