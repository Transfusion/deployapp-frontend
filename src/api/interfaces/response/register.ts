/**
 * Corresponds to RegisterResultDTO on the server side
 */
export interface RegisterResult {
  success: boolean,
  already_registered: boolean,
  pending_verification: boolean
}