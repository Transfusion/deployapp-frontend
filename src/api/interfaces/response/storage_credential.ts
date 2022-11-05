type StorageCredType = 'S3' | 'FTP'

/**
 * Corresponds to StorageCredentialDTO on the server side
 */
export interface StorageCredential {
  id: string;
  type: StorageCredType;
  name?: string;
  createdOn: Date;
  checkedOn: Date;
  lastUsed?: Date;
}

export interface S3Credential extends StorageCredential {
  server: string,
  accessKey: string,
  secretKey: string,
  bucket: string,
}

export function instanceOfS3Credential(object?: any): object is S3Credential {
  return object !== null && object !== undefined &&
    'server' in object &&
    'accessKey' in object &&
    'secretKey' in object &&
    'bucket' in object
}

/**
 * Corresponds to FtpCredentialDTO on the server side
 */
export interface FtpCredential extends StorageCredential {
  server: string,
  port: Number,
  username: string,
  password: string,
  directory: string,
  baseUrl: string,
}

export function instanceOfFtpCredential(object?: any): object is S3Credential {
  return object !== null && object !== undefined &&
    'server' in object &&
    'port' in object &&
    'username' in object &&
    'password' in object &&
    'directory' in object &&
    'baseUrl' in object 
}
