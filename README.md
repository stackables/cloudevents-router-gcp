# GCP cloud-events mapping

## Install

```
npm install cloudevents-router cloudevents-router-gcp
```

## Basic usage

```typescript
import { CloudEventsRouter } from 'cloudevents-router'
import type { GoogleEvents } from 'cloudevents-router-gcp'

const router = new CloudEventsRouter<GoogleEvents>()

router.on('google.cloud.pubsub.topic.v1.messagePublished', async (event) => {
    console.log('PubSub ordering key', event.data.message?.orderingKey)
})
```