import axiosClient from "./client";
import { ChangeEmailRequest } from "./interfaces/request/change_email_request";
import { ConfirmChangeEmailRequest } from "./interfaces/request/confirm_change_email_request";
import { ConfirmResetPasswordRequest } from "./interfaces/request/confirm_reset_password_request";
import { LoginRequest } from "./interfaces/request/login";
import { PatchProfileRequest } from "./interfaces/request/patch_profile";
import { RegisterRequest } from "./interfaces/request/register";
import { ResendVerificationRequest } from "./interfaces/request/resend_verification_request";
import { ResetPasswordRequest } from "./interfaces/request/reset_password_request";
import { VerifyRequest } from "./interfaces/request/verify";
import AuthProvider from "./interfaces/response/auth_provider";
import { LoginResult } from "./interfaces/response/login";
import Profile from "./interfaces/response/profile";
import { RegisterResult } from "./interfaces/response/register";
import { ResendVerificationResult } from "./interfaces/response/resend_verification";

export function getProfile() {
  return axiosClient.get<Profile>("/api/v1/user/profile");
}

export function getUnwrappedProfile() {
  return getProfile().then(x => x.data);
}

export function patchProfile(data: PatchProfileRequest) {
  return axiosClient.patch<Profile>("/api/v1/user/profile", data);
}

export function getConnectedAccounts() {
  return axiosClient.get<AuthProvider[]>("/api/v1/user/connectedAccounts");
}

export function getUnwrappedConnectedAccounts() {
  return getConnectedAccounts().then(x => x.data);
}

export function deleteConnectedAccount(providerName: string) {
  return axiosClient.delete<void>(`/api/v1/user/connectedAccounts/${providerName}`);
}

// authentication-related endpoints
export function login(data: LoginRequest) {
  return axiosClient.post<LoginResult>("/api/v1/user/login", data);
}

export function register(data: RegisterRequest) {
  return axiosClient.post<RegisterResult>("/api/v1/user/register", data);
}

export function verify(data: VerifyRequest) {
  return axiosClient.post<void>("/api/v1/user/verify", data);
}

export function resendVerification(data: ResendVerificationRequest) {
  return axiosClient.post<ResendVerificationResult>("/api/v1/user/resend_verification", data);
}

export function changeEmail(data: ChangeEmailRequest) {
  return axiosClient.post<void>("/api/v1/user/change_email", data);
}

export function confirmChangeEmail(data: ConfirmChangeEmailRequest) {
  return axiosClient.post<void>("/api/v1/user/confirm_change_email", data);
}

export function resetPassword(data: ResetPasswordRequest) {
  return axiosClient.post<void>("/api/v1/user/reset_password", data);
}

export function confirmResetPassword(data: ConfirmResetPasswordRequest) {
  return axiosClient.post<void>("/api/v1/user/confirm_reset_password", data);
}