export interface CreateS3CredentialRequest {
  name: string,
  server?: string,
  awsRegion: string,
  accessKey: string,
  secretKey: string,
  bucket: string,
  skipTestPublicAccess: boolean
}