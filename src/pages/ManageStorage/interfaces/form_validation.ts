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
  port: number,
  username: string,
  password: string,
  directory: string
  baseUrl: string
}

// used in Login/index.tsx
export interface LoginFormInputs {
  email: string,
  password: string,
}

export interface RegisterFormInputs {
  email: string,
  password: string,
  confirmPassword: string,
}

export interface ResendVerificationFormInputs {
  newEmail: string,
}