import LoggerService from 'lib/logger'
import Container, { Service } from 'typedi'

@Service()
class ContainerLoader {
  start (): void {
    Container.set('logger', LoggerService)
  }
}

export default ContainerLoader
