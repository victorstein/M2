import 'reflect-metadata'
import config from './config'
import notFound from './middlewares/notFound'
import Loaders from './loaders'
import * as Sentry from '@sentry/node'
import Container, { Inject } from 'typedi'
import { Application } from 'express'

class Init {
  @Inject()
  loaders: Loaders

  async waitForLoaders (): Promise<Application> {
    try {
      // Initialize all the loaders
      const app = await this.loaders.load()

      return app
    } catch (e) {
      throw new Error(e)
    }
  }

  async listen (app: Application, port: number = 3002) {
    // Create a promise to listen for errors on server listen
    return new Promise((resolve, reject) => {
      app.listen(port)
        .once('listening', () => resolve())
        .once('error', () => reject())
    })
  }

  async start () {
    try {
      // Get the express app
      const app = await this.waitForLoaders()

      // Start listening
      await this.listen(app, config.PORT)
      
      // Alert that the server is already in place
      console.log(`Server running at http://localhost:${config.PORT}/graphql 🚀`)

      // Handle 404
      app.use(notFound)
    } catch (e) {
      Sentry.captureException(e)
      throw new Error(e)
    }
  }
}

export const server = Container.get(Init)
server.start()