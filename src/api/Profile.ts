import axiosClient from "./client";
import { PatchProfileRequest } from "./interfaces/request/patch_profile";
import AuthProvider from "./interfaces/response/auth_provider";
import Profile from "./interfaces/response/profile";

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