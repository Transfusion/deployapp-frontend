/**
 * Corresponds to AppBinaryStoreJobDTO on the server side
 */
export interface AppBinaryStoreJob {
  id: string,
  name: string,
  status: 'PROCESSING' | 'ABORTED' | 'CANCELLING' | 'SUCCESSFUL',
  createdDate: Date,
  appBinaryId: string,
}