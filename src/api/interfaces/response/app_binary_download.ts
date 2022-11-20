/**
 * Corresponds to AppBinaryDownloadDTO on the server side
 */
export interface AppBinaryDownload {
  id: string,
  ts: Date,
  ip: string,
  ua: string,

  os?: string,
  version?: string
}