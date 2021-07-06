import { mongoose } from '@typegoose/typegoose'
import config from 'config'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { ContainerTypes, ILoader, LoaderTypes } from './types/loadersTypes'

@injectable()
class MongoLoader implements ILoader<LoaderTypes.VOID> {
  @inject(ContainerTypes.LOGGER) readonly logger: Logger

  async start (): Promise<void> {
    try {
      await mongoose.connect(config.DB_URL, {
        useNewUrlParser: true,
        dbName: config.ENV === 'test' ? 'test' : 'm2',
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      })

      this.logger.info('DB Connection Initialized successfully ✅')
    } catch ({ message }) {
      this.logger.error('Error initializing mongo: 💥 ->', message)
      throw new Error(message)
    }
  }
}

export default MongoLoader
