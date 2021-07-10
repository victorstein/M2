import { DocumentType } from '@typegoose/typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Logger } from 'winston'
import { UpdateQuery, FilterQuery, ObjectId } from 'mongoose'

@injectable()
export abstract class Service<T> {
  model: ModelType<T>
  @inject(ContainerTypes.LOGGER)
  logger: Logger

  async create (data: Partial<T>): Promise<DocumentType<T>> {
    this.logger.verbose(`Operation: create.\n Data: ${JSON.stringify(data, null, 2)}`)
    return await this.model.create(data)
  }

  async findById (id: ObjectId): Promise<DocumentType<T> | null> {
    this.logger.verbose(`Operation: findById.\n Id: ${String(id)}`)
    return await this.model.findById(id)
  }

  async findOneByParam (filter: FilterQuery<DocumentType<T>>): Promise<DocumentType<T> | null> {
    this.logger.verbose(`Operation: findByParam.\n filterQuery: ${JSON.stringify(filter, null, 2)}`)
    return await this.model.findOne(filter)
  }

  async updateOneById (id: ObjectId, data: UpdateQuery<DocumentType<T>>): Promise<DocumentType<T> | null> {
    this.logger.verbose(`Operation: updateOneById.\n Id: ${String(id)}. \n Data: ${JSON.stringify(data, null, 2)}`)
    return await this.model.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteOneById (id: ObjectId): Promise<void> {
    this.logger.verbose(`Operation: deleteOneById.\n Id: ${String(id)}`)
    await this.model.findByIdAndDelete(id)
  }

  async upsertById (id: ObjectId, data: UpdateQuery<DocumentType<T>>): Promise<DocumentType<T>> {
    this.logger.verbose(`Operation: upsertById.\n Id: ${String(id)}. \n Data: ${JSON.stringify(data, null, 2)}`)
    const { value } = await this.model.findByIdAndUpdate(id, data, { upsert: true, rawResult: true, new: true })
    return value as DocumentType<T>
  }

  async upsertByParam (filter: FilterQuery<DocumentType<T>>, data: UpdateQuery<DocumentType<T>>): Promise<DocumentType<T>> {
    this.logger.verbose(`Operation: upsertByParam.\n filterQuery: ${JSON.stringify(filter, null, 2)}. \n Data: ${JSON.stringify(data, null, 2)}`)
    const { value } = await this.model.findOneAndUpdate(filter, data, { upsert: true, rawResult: true, new: true })
    return value as DocumentType<T>
  }
}
