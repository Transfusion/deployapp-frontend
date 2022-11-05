export interface UploadAppBinaryRequest {
  credentialCreatedOn: Date,
  binary: File,
  storageCredentialId: string,
  organizationId?: string
}