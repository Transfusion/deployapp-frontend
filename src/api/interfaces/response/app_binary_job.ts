/**
 * Corresponds to AppBinaryJobDTO on the server side
 */
export interface AppBinaryJob {
  id: string,
  appBinaryId: string,
  name: string,
  description?: string
  createdDate: Date,
}