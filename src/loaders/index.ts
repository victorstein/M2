import { ApolloServer } from 'apollo-server-express'
import config from 'config'
import { Application } from 'express'
import { inject, injectable } from 'inversify'
import { Transporter } from 'nodemailer'
import { ContainerTypes, ILoader } from './types/loadersTypes'
@injectable()
class Loaders {
  @inject(ContainerTypes.EXPRESS_LOADER) private readonly express: ILoader<Application>
  @inject(ContainerTypes.APOLLO_LOADER) private readonly apollo: ILoader<Promise<ApolloServer>>
  @inject(ContainerTypes.MONGO_LOADER) private readonly mongo: ILoader<Promise<void>>
  @inject(ContainerTypes.EMAIL_LOADER) private readonly email: ILoader<Promise<Transporter>>
  @inject(ContainerTypes.SUBSCRIBER_LOADER) private readonly subscriber: ILoader<void>

  async load (): Promise<Application> {
    try {
      // Create express app
      const app = this.express.start()

      // Connect to the DB
      await this.mongo.start()

      // Initiate email transport
      await this.email.start()

      // Initiate subscribers
      this.subscriber.start()

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
