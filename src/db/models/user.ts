import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { injectable } from 'inversify'
import { Field, ID, ObjectType } from 'type-graphql'
import Role from './role'

@injectable()
@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
class User {
  @Field(() => ID)
  id: string

  @Field()
  @prop({ required: true })
  firstName: string

  @Field()
  @prop({ required: true })
  lastName: string

  @Field({ nullable: false })
  @prop({ required: true, lowercase: true })
  email: string

  @prop({ required: true })
  password: string

  @Field(() => Role)
  @prop({ ref: () => Role, required: true })
  role: Ref<Role>

  @prop({ default: 1 })
  tokenVersion: number

  @Field()
  @prop({ default: false })
  emailVerified: boolean

  public get fullName (): string {
    return `${this.firstName} ${this.lastName}`
  }
}

export default User
