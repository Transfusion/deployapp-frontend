import { Json } from "../../../types/misc";

/**
 * Corresponds to AppBinaryAssetDTO on the server side
 */
export interface AppBinaryAsset {
  id: string,
  appBinaryId: string,
  type: string,
  status?: string,
  fileName?: string,
  description?: string,
  value?: Json
}
