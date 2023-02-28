import axiosClient from "./client";
import { ActuatorInfo } from "./interfaces/response/actuator_info";

export function getBackendInfo() {
  return axiosClient.get<ActuatorInfo>("/actuator/info", {
    withCredentials: false // override
  });
}

export function getUnwrappedBackendInfo() {
  return getBackendInfo().then(resp => resp.data);
}