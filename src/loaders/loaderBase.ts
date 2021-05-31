import logger from 'lib/logger'
import { Service } from 'typedi'
import { Logger } from 'winston'

@Service()
abstract class LoaderBase {
  public logger: Logger

  constructor () {
    this.logger = logger
  }

  abstract start (): Promise<void> | void
}

export default LoaderBase
