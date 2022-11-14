export interface CreateFtpCredentialRequest {
  name: string,
  server: string,
  port: number,
  username: string,
  password: string,
  directory: string,
  baseUrl: string,
}