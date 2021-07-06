import { modelOptions, prop } from '@typegoose/typegoose'
import { injectable } from 'inversify'
import { Field, ID, ObjectType } from 'type-graphql'
import { Model } from './model'

@injectable()
@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
class Permission extends Model<Permission> {
  @Field(() => ID)
  id: string

  @Field()
  @prop({ required: true })
  name: string

  @Field()
  @prop({ required: true })
  description: string
}

export default Permission
