import type { CloudEventsRouter } from 'cloudevents-router'
import { GoogleEvents } from '.'

type PublishOptions<T> = {
    topics: { [key: string]: keyof T }
    onUnhandled?: 'DEFAULT' | 'REJECT' | 'IGNORE'
}

export function republishPubSubByTopic<T extends GoogleEvents>(events: CloudEventsRouter<T>, opts: PublishOptions<T>) {

    events.on('google.cloud.pubsub.topic.v1.messagePublished', (event) => {

        // Topic format "//pubsub.googleapis.com/projects/serverless-com-demo/topics/my-topic"
        const topic = event.source.split('/').pop() as string
        const mapped = opts.topics?.[topic] as string

        if (!mapped && opts.onUnhandled === 'REJECT') {
            throw new Error('Message from unknown topic: ' + topic)
        }

        if (!mapped && opts.onUnhandled === 'IGNORE') {
            return
        }

        // Republish event
        const e = event.cloneWith({
            type: mapped,
            data: {
                ...event.data,
                message: {
                    ...event.data?.message,
                    data: event.data?.message?.data ? JSON.parse(Buffer.from(event.data.message.data, 'base64').toString()) : undefined
                }
            }
        })

        return events.process(e)
    })

}