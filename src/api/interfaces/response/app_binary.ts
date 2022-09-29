import { Json } from "../../../types/misc";

type AppBinaryType = 'IPA' | 'APK'

/**
 * Corresponds to AppBinaryDTO on the server side
 */
export interface AppBinary {
  id: string;
  type: AppBinaryType;
  version: String,
  build: String,
  uploadDate: Date,
  name: String,
  lastInstallDate?: Date,
  identifier: String,
  assetsOnFrontPage: Boolean,
  sizeBytes: Number,
  fileName: String,
  storageCredential: String,
}

export interface Ipa extends AppBinary {
  minSdkVersion: string,
  iphone: boolean,
  ipad: boolean,
  universal: boolean,
  deviceType?: string,
  archs: string[],
  displayName?: string,
  releaseType?: string,
  buildType?: string,
  devices?: string[],
  teamName?: string,
  expiredDate?: Date,
  plistJson: Json,
}