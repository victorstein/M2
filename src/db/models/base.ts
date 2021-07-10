import { DocumentType, post, pre, prop, Ref } from '@typegoose/typegoose'
import { injectable } from 'inversify'
import containerLoader from 'loaders/containerLoader'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Field, ObjectType } from 'type-graphql'
import User from './user'

@post<Base>('findOneAndUpdate', function (doc: any, next) {
  const { lastErrorObject: { updatedExisting }, value } = doc
  const base: DocumentType<Base> = value
  const userId: Ref<User> = containerLoader.get(ContainerTypes.USER_CONTEXT)

  const isNew = updatedExisting !== true

  if (isNew && userId !== null) {
    // Set the createdby value
    base.set({ createdBy: userId })
    return base.save({ validateBeforeSave: false })
      .then(() => next())
  }

  if (!isNew && userId !== null) {
    // Set the lastUpdatedBy value
    base.set({ lastUpdatedBy: userId })
    return base.save({ validateBeforeSave: false })
      .then(() => next())
  }

  return next()
})

@pre<Base>('validate', function (next) {
  const userId: Ref<User> = containerLoader.get(ContainerTypes.USER_CONTEXT)

  if (this.isNew && userId !== undefined) {
    this.createdBy = userId
    return next()
  }

  this.lastUpdatedBy = userId
  return next()
})

@ObjectType()
@injectable()
class Base {
  @Field(() => String, { nullable: true })
  @prop({ ref: () => User, required: false })
  createdBy: Ref<User>

  @Field(() => String, { nullable: true })
  @prop({ ref: () => User, required: false })
  lastUpdatedBy: Ref<User>
}

export default Base
