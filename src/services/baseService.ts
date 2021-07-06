import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Logger } from 'winston'

@injectable()
class BaseService {
  constructor (
    @inject(ContainerTypes.LOGGER) readonly logger: Logger
  ) {}

  hello (): String {
    this.logger.info('logging is working')
    return 'World'
  }
}

export default BaseService
