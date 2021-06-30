import 'reflect-metadata'
import config from './config'
import Loaders from './loaders'
import Container, { Inject, Service } from 'typedi'
import { Application, RequestHandler } from 'express'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Logger } from 'winston'
import ContainerLoader from 'loaders/containerLoader'

@Service()
class Init {
  @Inject()
  loaders: Loaders

  @Inject(ContainerTypes.NOTFOUND)
  notFound: RequestHandler

  @Inject(ContainerTypes.LOGGER)
  logger: Logger

  async waitForLoaders (): Promise<Application> {
    try {
      // Initialize all the loaders
      const app = await this.loaders.load()

      return app
    } catch (e) {
      throw new Error(e)
    }
  }

  async listen (app: Application, port: number = 3002): Promise<void> {
    // Create a promise to listen for errors on server listen
    return await new Promise((resolve, reject) => {
      app.listen(port)
        .once('listening', () => resolve())
        .once('error', (e) => reject(e))
    })
  }

  async start (): Promise<void> {
    try {
      // Get the express app
      const app = await this.waitForLoaders()

      // Start listening
      await this.listen(app, config.PORT)

      // Alert that the server is already in place
      this.logger.info(`Server running at http://localhost:${config.PORT}/graphql 🚀`)

      // Handle 404
      app.use(this.notFound)
    } catch (e) {
      this.logger.error(e)
      throw new Error(e)
    }
  }
}

// Start container
new ContainerLoader().start()
export const server = Container.get(Init)

server.start()
  .then(() => console.log('Server Started'))
  .catch(() => { /* Error being handled in the actual method */ })
