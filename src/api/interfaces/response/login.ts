/**
 * Corresponds to LoginResultDTO on the server side
 */
export interface LoginResult {
  success: boolean,
  userId: string,
  badCredentials?: boolean,
  disabled?: boolean,
  error?: string
}