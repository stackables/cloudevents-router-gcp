import { PubSubParsedMessage } from "..";

/**
 * The GCP artifact message payload
 * 
 * @see https://cloud.google.com/container-registry/docs/configuring-notifications
 */
export type ArtifactMessage = PubSubParsedMessage<{
    action: 'INSERT' | 'DELETE',
    digest?: string
    tag?: string
}>