import { Json } from "../../../types/misc";
import { BINARY_TYPES } from "../../../utils/constants";

type AppBinaryType = 'IPA' | 'APK'

/**
 * Corresponds to AppBinaryDTO on the server side
 */
export interface AppBinary {
  id: string;
  type: AppBinaryType;
  version: string,
  build: string,
  uploadDate: Date,
  name: string,
  lastInstallDate?: Date,
  identifier: string,
  assetsOnFrontPage: boolean,
  sizeBytes: number,
  fileName: string,
  storageCredential: string,
  description?: string
  available: boolean,

  organizationId?: string,
  userId?: string,
}

export interface Ipa extends AppBinary {
  minSdkVersion: string,
  iphone: boolean,
  ipad: boolean,
  universal: boolean,
  deviceType?: string,
  archs?: string[],
  displayName?: string,
  releaseType?: string,
  buildType?: string,
  devices?: string[],
  teamName?: string,
  expiredDate?: Date,
  plistJson: Json,
}

export function instanceOfIpa(object?: AppBinary): object is Ipa {
  return object !== undefined && object !== null
    && object?.type === BINARY_TYPES.IPA;
}