import axiosClient from "./client";
import { UploadAppBinaryRequest } from "./interfaces/request/upload_appbinary";
import { AppBinary } from "./interfaces/response/app_binary";

export function uploadAppBinary(data: UploadAppBinaryRequest,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
  signal?: AbortSignal
) {
  return axiosClient.post<AppBinary>(`/storage/api/v1/app/binary`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Accept": "*/*"
    },
    onUploadProgress,
    signal
  });
}

export function uploadAppBinaryUnwrapped(data: UploadAppBinaryRequest,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
  signal?: AbortSignal
) {
  return uploadAppBinary(data, onUploadProgress, signal).then(x => x.data);
}