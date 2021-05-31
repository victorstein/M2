import LoggerService from 'lib/logger'
import Container, { Service } from 'typedi'
import LoaderBase from './loaderBase'
import { CONTAINER } from './types/loaders.types'

@Service()
class ContainerLoader extends LoaderBase {
  start (): void {
    Container.set(CONTAINER.LOGGER, LoggerService)
    this.logger.info('Container Initialized successfully ✅')
  }
}

export default ContainerLoader
