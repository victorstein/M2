import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Inject, Service } from 'typedi'
import { Logger } from 'winston'

@Service()
class BaseService {
  constructor (
    @Inject(ContainerTypes.LOGGER) readonly logger: Logger
  ) {}

  hello (): String {
    this.logger.info('logging is working')
    return 'World'
  }
}

export default BaseService
