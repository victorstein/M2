import { getModelForClass } from '@typegoose/typegoose'
import { AnyParamConstructor, ModelType } from '@typegoose/typegoose/lib/types'
import { injectable } from 'inversify'

@injectable()
export class Model<T> {
  get model (): ModelType<T> {
    const classConstructor = this.constructor as unknown as AnyParamConstructor<T>
    return getModelForClass(classConstructor)
  }
}
