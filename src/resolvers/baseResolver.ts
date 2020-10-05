import { Query, Resolver } from "type-graphql";

@Resolver()
export default class base {
  @Query(() => String)
  hello () { return 'world' }
}