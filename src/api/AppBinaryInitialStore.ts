import axiosClient from "./client";
import { AppBinaryStoreJob } from "./interfaces/response/app_binary_store_job";

export function getInitialStorageJobs() {
  return axiosClient.get<AppBinaryStoreJob[]>("/storage/api/v1/app/initial_storage_jobs");
}

export async function getUnwrappedInitialStorageJobs() {
  const x = await getInitialStorageJobs();
  return x.data;
}

export function cancelInitialStoreJob(id: string) {
  return axiosClient.post<void>(`/storage/api/v1/app/initial_storage_jobs/${id}/cancel`);
}

export function deleteInitialStoreJob(id: string) {
  return axiosClient.delete<void>(`/storage/api/v1/app/initial_storage_jobs/${id}`);
}