import { Inject, Service } from 'typedi'
import winston from 'winston'

@Service()
class BaseService {
  constructor (
    @Inject('logger') readonly logger: winston.Logger
  ) {}

  hello (): String {
    this.logger.info('some shit')
    return 'World'
  }
}

export default BaseService
