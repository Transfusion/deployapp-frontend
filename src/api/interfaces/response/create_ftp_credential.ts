import { FtpCredential } from "./storage_credential";

export interface CreateFtpCredentialResponse {
  success: boolean,
  id?: string,

  testConnection: boolean,
  testConnectionError: string,

  testWriteFolder: boolean,
  testWriteFolderError: string,

  testPublicAccess: boolean,
  testPublicAccessError: string,

  credential?: FtpCredential,
}

// used in CreateUnsuccessfulAlert
export function instanceOfCreateFtpCredentialResponse(object?: any): object is CreateFtpCredentialResponse {
  return object !== null && object !== undefined &&
    'success' in object &&
    'id' in object &&
    'testConnection' in object &&
    'testConnectionError' in object &&
    'testWriteFolder' in object &&
    'testWriteFolderError' in object &&
    'testPublicAccess' in object &&
    'testPublicAccessError' in object &&
    'credential' in object;
}