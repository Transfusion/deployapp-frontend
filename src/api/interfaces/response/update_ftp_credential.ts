import { CreateFtpCredentialResponse } from "./create_ftp_credential";

export type UpdateFtpCredentialResponse = CreateFtpCredentialResponse;


// used in CreateUnsuccessfulAlert
export function instanceOfUpdateFtpCredentialResponse(object?: any): object is UpdateFtpCredentialResponse {
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