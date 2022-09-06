import axiosClient from "./client"

export function Logout() {
  return axiosClient.post("/api/logout");
}
