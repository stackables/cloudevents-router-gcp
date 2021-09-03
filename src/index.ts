import type { Message, MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData'

export type PubSubParsedMessage<T> =
    Omit<MessagePublishedData, "message"> & {
        message: Omit<Message, "data"> & {
            data: T
            messageId: string
        }
    }

export { GoogleEvents } from './generated'
export { republishPubSubByTopic } from './pubsub-splitter'