export interface S3FormInputs {
  name: string;
  server?: string,
  awsRegion: string,
  accessKey: string,
  secretKey: string,
  bucket: string,

  skipTestPublicAccess: boolean,
}

export interface FtpFormInputs {
  name: string,
  server: string,
  port: string,
  username: string,
  password: string,
  directory: string
  baseUrl: string
}
