import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import BaseService from 'services/baseService'
import { Query, Resolver } from 'type-graphql'

@Resolver()
@injectable()
class Base {
  constructor (
    @inject(ContainerTypes.BASE_SERVICE) private readonly baseService: BaseService
  ) {}

  @Query(() => String)
  hello (): String {
    return this.baseService.hello()
  }
}

export default Base
