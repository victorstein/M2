import { EventEmitter } from 'events'
import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Event } from 'subscribers/types/subscriberTypes'
import { Logger } from 'winston'
import { Constructor, EventSubscriberMetadata } from './types/decoratorTypes'

const methodHandler = Symbol('methodHandler')
const eventEmitter = new EventEmitter()

@injectable()
export class EventDispatcher {
  @inject(ContainerTypes.LOGGER) logger: Logger
  eventEmitter: EventEmitter

  constructor () {
    this.eventEmitter = eventEmitter
  }

  dispatch<T> (event: Event, data: T): void {
    this.logger.verbose(`dispatching event: ${event}`)
    this.eventEmitter.emit(event, data)
  }

  removeAllListeners (): void {
    this.eventEmitter.removeAllListeners()
  }
}

export function EventSubscriber () {
  return function <T extends Constructor> (target: T) {
    return class extends target {
      constructor (...args: any[]) {
        super(...args)

        const registeredMethods = target.prototype[methodHandler].length > 0 ? target.prototype[methodHandler] : []
        registeredMethods.forEach(({ event, methodName }: EventSubscriberMetadata) => {
          if (Array.isArray(event)) {
            event.forEach((event) => eventEmitter.on(event, target.prototype[methodName].bind(this)))
          } else {
            eventEmitter.on(event, target.prototype[methodName].bind(this))
          }
        })
      }
    }
  }
}

export function On (event: string | string[]) {
  return function (target: any, methodName: string) {
    const currentMethod = target[methodHandler] as [] | undefined
    target[methodHandler] = currentMethod ?? []

    // Build the required metadata
    const meta: EventSubscriberMetadata = {
      methodName,
      event
    }

    target[methodHandler].push(meta)
  }
}
