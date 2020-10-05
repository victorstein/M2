import 'reflect-metadata'
import config from './config'
import notFound from './middlewares/notFound'
import Loaders from './loaders'
import * as Sentry from '@sentry/node'

(async () => {
  try {
    // Initialize all the loaders
    const app = await Loaders.load()

    // Start listening
    app.listen(config.PORT, () => {
      console.log(`Server running in at http://localhost:${config.PORT}/graphql 🚀`)
    })
    
    // Handle 404
    app.use(notFound)
  } catch (e) {
    Sentry.captureException(e)
    console.log(e)
  }
})()