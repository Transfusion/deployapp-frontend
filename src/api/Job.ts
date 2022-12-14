/**
 * Makes requests to the Background jobs-related controller
 */

import axiosClient from "./client";

export function cancelJob(id: string) {
  return axiosClient.delete<void>(`/storage/api/v1/job/${id}`);
}