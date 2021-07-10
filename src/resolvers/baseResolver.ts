import Base from 'db/models/base'
import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { UserService } from 'services/userService'
import { FieldResolver, Query, Resolver, Root } from 'type-graphql'

@Resolver(() => Base)
@injectable()
class BaseResolver {
  @inject(ContainerTypes.USER_SERVICE)
  userService: UserService

  @Query(() => String)
  hello (): String {
    return 'world'
  }

  @FieldResolver(() => String)
  async createdBy (@Root() root: any): Promise<string> {
    const user = await this.userService.findById(root.createdBy)
    return user?.fullName ?? ''
  }
}

export default BaseResolver
