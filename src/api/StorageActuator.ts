import axiosClient from "./client";
import { ActuatorInfo } from "./interfaces/response/actuator_info";

export function getStorageInfo() {
  return axiosClient.get<ActuatorInfo>("/storage/actuator/info", {
    withCredentials: false // override
  });
}

export function getUnwrappedStorageInfo() {
  return getStorageInfo().then(resp => resp.data);
}