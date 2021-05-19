import LoggerService from 'lib/logger'
import Container, { Service } from 'typedi'
import LoaderBase from './loaderBase'

@Service()
class ContainerLoader extends LoaderBase {
  start (): void {
    Container.set('logger', LoggerService)
    this.logger.info('Container Initialized successfully ✅')
  }
}

export default ContainerLoader
