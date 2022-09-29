import axiosClient from "./client"
import Profile from "./interfaces/response/profile"

export function getProfile() {
  return axiosClient.get<Profile>("/api/v1/user/profile");
}

export function getUnwrappedProfile() {
  return getProfile().then(x => x.data);
}