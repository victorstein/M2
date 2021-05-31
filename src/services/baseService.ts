import { CONTAINER } from 'loaders/types/loaders.types'
import { Inject, Service } from 'typedi'
import { Logger } from 'winston'

@Service()
class BaseService {
  @Inject(CONTAINER.LOGGER) readonly logger: Logger

  hello (): String {
    this.logger.info('resover info')
    return 'World'
  }
}

export default BaseService
