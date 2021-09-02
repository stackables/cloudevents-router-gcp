import { Message, MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData'
import { CloudEventsRouter } from 'cloudevents-router'
import { GoogleEvents } from '.'

export type PubSubParsedMessage<T> =
    Omit<MessagePublishedData, "message"> & {
        message: Omit<Message, "data"> & {
            data: T
            messageId: string
        }
    }

type PublishOptions = {
    include: string[]
}

export function republishPubSubByTopic(events: CloudEventsRouter<GoogleEvents>, opts: PublishOptions) {

    events.on('google.cloud.pubsub.topic.v1.messagePublished', (event) => {

        // //pubsub.googleapis.com/projects/serverless-com-demo/topics/my-topic
        const topicMatch = event.source.match(/.*\/topics\/([^\/]+)/)
        if (!topicMatch) {
            throw new Error('Unable to determine topic')
        }

        const topic = topicMatch[1]

        if (!opts.include.includes(topic)) {
            throw new Error('Message from unknown topic: ' + topic)
        }

        // Republish the event as local.pubsub.topic.*
        const e = event.cloneWith({
            type: 'local.pubsub.topic.' + topic,
            data: {
                ...event.data,
                message: {
                    ...event.data.message,
                    data: event.data.message?.data ? JSON.parse(Buffer.from(event.data.message.data, 'base64').toString()) : undefined
                }
            }
        })
        return events.process(e)
    })

}