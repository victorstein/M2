import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { injectable } from 'inversify'
import { Field, ID, ObjectType } from 'type-graphql'
import { Model } from './model'
import Permission from './permission'
import Role from './role'

@injectable()
@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
class User extends Model<User> {
  @Field(() => ID)
  id: string

  @Field()
  @prop({ required: true })
  firstName: string

  @Field()
  @prop({ required: true })
  lastName: string

  @Field()
  @prop({ required: true, lowercase: true })
  email: string

  @prop({ required: true })
  password: string

  @Field(() => Role)
  @prop({ ref: () => Role })
  role: Ref<Role>

  @Field(() => [Permission], { nullable: true })
  @prop({ ref: () => Permission })
  permissions: Array<Ref<Permission>>

  @prop({ default: 1 })
  tokenVersion: number
}

export default User
