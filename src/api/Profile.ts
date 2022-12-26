import axiosClient from "./client";
import { LoginRequest } from "./interfaces/request/login";
import { PatchProfileRequest } from "./interfaces/request/patch_profile";
import { RegisterRequest } from "./interfaces/request/register";
import { ResendVerificationRequest } from "./interfaces/request/resend_verification_request";
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