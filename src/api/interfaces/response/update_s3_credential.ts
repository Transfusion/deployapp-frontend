import { CreateS3CredentialResponse } from "./create_s3_credential";

export type UpdateS3CredentialResponse = CreateS3CredentialResponse;

// used in CreateUnsuccessfulAlert
export function instanceOfUpdateS3CredentialResponse(object?: any): object is UpdateS3CredentialResponse {
  return object !== null && object !== undefined &&
    'success' in object &&
    'id' in object &&
    'testHeadBucketSuccess' in object &&
    'testHeadBucketError' in object &&
    'skipTestPublicAccess' in object &&
    'testPublicAccessSuccess' in object &&
    'testPublicAccessError' in object &&
    'testSignedLinkSuccess' in object &&
    'testSignedLinkError' in object &&
    'credential' in object;
}