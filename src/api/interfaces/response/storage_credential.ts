type StorageCredType = 'S3' | 'FTP'

/**
 * Corresponds to StorageCredentialDTO on the server side
 */
export interface StorageCredential {
  id: string;
  type: StorageCredType;
  name?: string;
  createdOn?: Date;
  checkedOn?: Date;
  lastUsed?: Date;
}

export interface S3Credential extends StorageCredential {
  server: string,
  accessKey: string,
  secretKey: string,
  bucket: string,
}

export interface FtpCredential extends StorageCredential {
  server: string,
  port: Number,
  username: string,
  password: string,
  directory: string,
  baseUrl: string,
}
