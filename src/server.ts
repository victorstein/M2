import 'reflect-metadata'
import config from './config'
import notFound from './middlewares/notFound'
import Loaders from './loaders'
import * as Sentry from '@sentry/node'
import Container, { Inject } from 'typedi'

class Init {
  @Inject()
  loaders: Loaders

  async start () {
    try {
      // Initialize all the loaders
      const app = await this.loaders.load()

      // Start listening
      app.listen(config.PORT, () => {
        console.log(`Server running at http://localhost:${config.PORT}/graphql 🚀`)
      })
      
      // Handle 404
      app.use(notFound)
    } catch (e) {
      Sentry.captureException(e)
      console.log(e)
    }
  }
}

const server = Container.get(Init)
server.start()