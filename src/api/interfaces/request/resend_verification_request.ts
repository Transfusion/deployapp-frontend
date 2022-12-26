export interface ResendVerificationRequest {
  email: string,
  newEmail?: string,
  redirectBaseUrl: string,
}