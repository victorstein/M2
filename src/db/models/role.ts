import { modelOptions, prop } from '@typegoose/typegoose'
import { injectable } from 'inversify'
import { Field, ID, ObjectType } from 'type-graphql'
import Base from './base'
import { Roles } from './types/modelsTypes'

@injectable()
@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
class Role extends Base {
  @Field(() => ID)
  id: string

  @Field()
  @prop()
  name: string

  @prop({ required: true, enum: Roles, index: true, immutable: true })
  type: Roles

  @Field()
  @prop({ required: true })
  description: string
}

export default Role
