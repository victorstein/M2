import { Service } from 'typedi'

@Service()
class BaseService {
  hello (): String {
    return 'World'
  }
}

export default BaseService
