import { Service } from "typedi"

@Service()
export default class BaseService {
  hello (): String {
    return 'World'
  }
}