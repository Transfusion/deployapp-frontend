import axiosClient from "./client";
import { AppBinaryAlias } from "./interfaces/response/app_binary_alias";

export function getAppBinaryAliases(id: string) {
  return axiosClient.get<AppBinaryAlias[]>(`/storage/api/v1/app/binary/${id}/alias`);
}

export async function getUnwrappedAppBinaryAliases(id: string) {
  const x = await getAppBinaryAliases(id);
  return x.data;
}

export function deleteAppBinaryAlias(id: string, alias: string) {
  return axiosClient.delete<void>(`/storage/api/v1/app/binary/${id}/alias/${alias}`);
}

export function shorten(id: string) {
  return axiosClient.post<void>(`/storage/api/v1/app/binary/${id}/shorten`);
}

export function getAppBinaryAlias(alias: string) {
  return axiosClient.get<AppBinaryAlias>(`/storage/api/v1/app/alias/${alias}`);
}

export async function getUnwrappedAppBinaryAlias(alias: string) {
  const x = await getAppBinaryAlias(alias);
  return x.data;
}