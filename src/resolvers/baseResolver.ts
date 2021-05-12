import BaseService from 'services/baseService'
import { Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

@Resolver()
@Service()
class Base {
  constructor (
    private readonly baseService: BaseService
  ) {}

  @Query(() => String)
  hello (): String {
    return this.baseService.hello()
  }
}

export default Base
