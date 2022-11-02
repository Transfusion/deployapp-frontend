import { S3Credential } from "./storage_credential";

export interface CreateS3CredentialResponse {
  success: boolean,
  testHeadBucketSuccess: boolean,
  testHeadBucketError: string,
  skipTestPublicAccess: boolean,
  testPublicAccessSuccess: boolean,
  testPublicAccessError: string,
  testSignedLinkSuccess: boolean,
  testSignedLinkError: string,

  credential?: S3Credential,
}

// used in CreateUnsuccessfulAlert
export function instanceOfCreateS3CredentialResponse(object?: any): object is CreateS3CredentialResponse {
  return object !== null && object !== undefined &&
    'success' in object &&
    'testHeadBucketSuccess' in object &&
    'testHeadBucketError' in object &&
    'skipTestPublicAccess' in object &&
    'testPublicAccessSuccess' in object &&
    'testPublicAccessError' in object &&
    'testSignedLinkSuccess' in object &&
    'testSignedLinkError' in object &&
    'credential' in object;
}