[![npm](https://img.shields.io/npm/v/cloudevents-router-gcp?label=cloudevents-router-gcp&logo=npm)](https://www.npmjs.com/package/cloudevents-router-gcp)

# GCP CloudEvents mapping

This library is designed to work with [cloudevents-router](https://github.com/stackables/cloudevents-router) package.

We generate a mapping for all Google CloudEvents based on JSON Schema catalog published at [googleapis/google-cloudevents](https://github.com/googleapis/google-cloudevents)

Last update: 2021-09-03

## Install

```bash
npm install cloudevents-router-gcp
```

## Use just types

```typescript
import type { GoogleEvents } from 'cloudevents-router-gcp'

/*
Will be equal to the following code snippet:

import { LogEntryData } from '@google/events/cloud/audit/v1/LogEntryData'
import { MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData'
...

export type GoogleEvents = {
  'google.cloud.audit.log.v1.written': LogEntryData
  'google.cloud.pubsub.topic.v1.messagePublished': MessagePublishedData
  ...
}
*/
```

## Use with cloudevents-router

```typescript
import type { GoogleEvents } from 'cloudevents-router-gcp'
import { CloudEventsRouter, getMiddleware } from 'cloudevents-router'
import http from "http"

const router = new CloudEventsRouter<GoogleEvents>()

router.on('google.cloud.pubsub.topic.v1.messagePublished', async (event) => {
    console.log('PubSub ordering key', event.data.message?.orderingKey)
})

// See cloudevents-router documentation for more integration examples
const middleware = getMiddleware(router, { path: '/' })
const server = http.createServer(middleware)

server.listen(5000);
```

## PubSub instructions

While consuming PubSub events with cloudevents is simple the type definition for PubSub is not very useful.

Payload is passed as `string` or `undefined`, and all topics end up in the same handler (as message type is always `google.cloud.pubsub.topic.v1.messagePublished`).

```typescript
interface MessagePublishedData {
  subscription?: string
  message?:  {
    attributes?: {[key: string]: string}
    data?: string
    messageId?: string
    orderingKey?: string
    publishTime?: Date | string
  }
}
```

To make it a bit less painful we ship a `PubSubParsedMessage<T>` generic type and some helper functions to parse and re-route the PubSub messages.

### 1. Define your JSON message types

```typescript
import type { GoogleEvents, PubSubParsedMessage } from 'cloudevents-router-gcp'

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
}
```

This will replace data attribute (`data?: string`) in the original `MessagePublishedData` type with a more useful extracted type definition.

### 2. Write handlers for your messages

```typescript
import { CloudEventsRouter } from 'cloudevents-router'

const router = new CloudEventsRouter<EventMap>()

router.on('pubsub.profileChanged', async (event) => {
    console.log('Profile picture added', event.data.message?.data.profilePicture)
})
```

### 3. Parse and consume PubSub messages

To use the above handler we need to parse and republish PubSub messages

```typescript
import { republishPubSubByTopic } from 'cloudevents-router-gcp'

// use the router from above
// const router = ...

republishPubSubByTopic(router, {
    topics: {
        'user-added-topic': 'pubsub.userAdded',
        'profile-changed-topic': 'pubsub.profileChanged'
    }
})

// setup server as above
// const server = ...
server.listen(5000);
```

## Thats it ...

... happy coding :)
