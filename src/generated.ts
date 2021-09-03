import { LogEntryData } from '@google/events/cloud/audit/v1/LogEntryData'
import { BuildEventData } from '@google/events/cloud/cloudbuild/v1/BuildEventData'
import { DocumentEventData } from '@google/events/cloud/firestore/v1/DocumentEventData'
import { MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData'
import { SchedulerJobData } from '@google/events/cloud/scheduler/v1/SchedulerJobData'
import { StorageObjectData } from '@google/events/cloud/storage/v1/StorageObjectData'
import { AnalyticsLogData } from '@google/events/firebase/analytics/v1/AnalyticsLogData'
import { AuthEventData } from '@google/events/firebase/auth/v1/AuthEventData'
import { ReferenceEventData } from '@google/events/firebase/database/v1/ReferenceEventData'
import { RemoteConfigEventData } from '@google/events/firebase/remoteconfig/v1/RemoteConfigEventData'

export type GoogleEvents = {
  'google.cloud.audit.log.v1.written': LogEntryData
  'google.cloud.cloudbuild.build.v1.statusChanged': BuildEventData
  'google.cloud.firestore.document.v1.created': DocumentEventData
  'google.cloud.firestore.document.v1.updated': DocumentEventData
  'google.cloud.firestore.document.v1.deleted': DocumentEventData
  'google.cloud.firestore.document.v1.written': DocumentEventData
  'google.cloud.pubsub.topic.v1.messagePublished': MessagePublishedData
  'google.cloud.scheduler.job.v1.executed': SchedulerJobData
  'google.cloud.storage.object.v1.finalized': StorageObjectData
  'google.cloud.storage.object.v1.archived': StorageObjectData
  'google.cloud.storage.object.v1.deleted': StorageObjectData
  'google.cloud.storage.object.v1.metadataUpdated': StorageObjectData
  'google.firebase.analytics.log.v1.written': AnalyticsLogData
  'google.firebase.auth.user.v1.created': AuthEventData
  'google.firebase.auth.user.v1.deleted': AuthEventData
  'google.firebase.database.ref.v1.created': ReferenceEventData
  'google.firebase.database.ref.v1.updated': ReferenceEventData
  'google.firebase.database.ref.v1.deleted': ReferenceEventData
  'google.firebase.database.ref.v1.written': ReferenceEventData
  'google.firebase.remoteconfig.remoteConfig.v1.updated': RemoteConfigEventData
}