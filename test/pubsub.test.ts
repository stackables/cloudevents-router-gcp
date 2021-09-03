import { CloudEvent } from 'cloudevents'
import { CloudEventsRouter } from 'cloudevents-router'
import { GoogleEvents, PubSubParsedMessage, republishPubSubByTopic } from '../src'
import omitDeep from 'omit-deep-lodash'

// Define message payload type
type EventMap = GoogleEvents & {
    'pubsub.userAdded': PubSubParsedMessage<{
        username: string
        password: string
        age?: number
    }>
    'pubsub.profileChanged': PubSubParsedMessage<{
        username: string
        profilePicture: string
    }>
    'pubsub.emptyData': PubSubParsedMessage<void>
}

function publishFakeEvent(router: CloudEventsRouter<any>, topic: string, payload: any) {

    const ce = new CloudEvent({
        type: 'google.cloud.pubsub.topic.v1.messagePublished',
        source: `//pubsub.googleapis.com/projects/test-project-id/topics/${topic}`,
        data: {
            message: {
                data: payload ? Buffer.from(JSON.stringify(payload)).toString('base64') : undefined,
                messageId: 'my-message-id',
                publishTime: '2020-08-14T20:50:04.994Z',
            },
            subscription: 'subscription',
        }
    })

    return router.process(ce)
}

test('Republish PubSub example - default', async () => {

    const events: any[] = []
    const router = new CloudEventsRouter<EventMap>()

    router.on('pubsub.profileChanged', async (event) => {
        events.push(event)
        events.push(event.data)
    })

    router.onUnhandled(async (event) => {
        events.push(event)
        events.push(event.data)
    })

    // republish the event
    republishPubSubByTopic(router, {
        topics: {
            'user-added-topic': 'pubsub.userAdded',
            'profile-changed-topic': 'pubsub.profileChanged'
        },
    })

    await publishFakeEvent(router, 'profile-changed-topic', { username: 'testuser1', profilePicture: 'http://picture.com' })
    await publishFakeEvent(router, 'user-added-topic', { username: 'testuser1', password: '***' })
    expect(omitDeep(events, 'id', 'time')).toMatchSnapshot()
})

test('Republish PubSub example - ignore', async () => {

    const events: any[] = []
    const router = new CloudEventsRouter<EventMap>()

    router.on('pubsub.profileChanged', async (event) => {
        events.push(event)
        events.push(event.data)
    })

    router.onUnhandled(async (event) => {
        events.push(event)
        events.push(event.data)
    })

    // republish the event
    republishPubSubByTopic(router, {
        topics: {
            'profile-changed-topic': 'pubsub.profileChanged'
        },
        onUnhandled: 'IGNORE'
    })

    await publishFakeEvent(router, 'profile-changed-topic', { username: 'testuser1', profilePicture: 'http://picture.com' })
    await publishFakeEvent(router, 'user-added-topic', { username: 'testuser1', password: '***' })
    expect(omitDeep(events, 'id', 'time')).toMatchSnapshot()
})

test('Republish PubSub example - reject', async () => {

    const events: any[] = []
    const router = new CloudEventsRouter<EventMap>()

    router.on('pubsub.profileChanged', async (event) => {
        events.push(event)
        events.push(event.data)
    })

    router.onUnhandled(async (event) => {
        events.push(event)
        events.push(event.data)
    })

    // republish the event
    republishPubSubByTopic(router, {
        topics: {
            'profile-changed-topic': 'pubsub.profileChanged'
        },
        onUnhandled: 'REJECT'
    })

    await publishFakeEvent(router, 'profile-changed-topic', { username: 'testuser1', profilePicture: 'http://picture.com' })
    await expect(() => publishFakeEvent(router, 'user-added-topic', { username: 'testuser1', password: '***' })).rejects.toThrow()
    expect(omitDeep(events, 'id', 'time')).toMatchSnapshot()
})

test('Republish PubSub example - empty', async () => {

    const events: any[] = []
    const router = new CloudEventsRouter<EventMap>()

    router.onUnhandled(async (event) => {
        events.push(event)
        events.push(event.data)
    })

    // republish the event
    republishPubSubByTopic(router, {
        topics: {
            'empty-message-test': 'pubsub.emptyData'
        }
    })

    await publishFakeEvent(router, 'empty-message-test', undefined)
    expect(omitDeep(events, 'id', 'time')).toMatchSnapshot()
})
