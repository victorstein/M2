import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { injectable } from 'inversify'
import { Field, ID, ObjectType } from 'type-graphql'
import { Model } from './model'
import Permission from './permission'
import { Roles } from './types/modelsTypes'

@injectable()
@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
class Role extends Model<Role> {
  @Field(() => ID)
  id: string

  @Field()
  @prop({ required: true, enum: Roles, index: true })
  name: Roles

  @Field()
  @prop({ required: true })
  description: string

  @Field(() => [Permission])
  @prop({ ref: () => Permission, required: true })
  permissions: Array<Ref<Permission>>
}

export default Role
