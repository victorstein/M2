import BaseService from "services/baseService";
import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";

@Resolver()
@Service()
export default class base {
  constructor (
    private baseService: BaseService
  ) {}

  @Query(() => String)
  hello () {
    return this.baseService.hello()
  }
}