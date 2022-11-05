import axiosClient from "./client";
import { UploadAppBinaryRequest } from "./interfaces/request/upload_appbinary";
import { AppBinary } from "./interfaces/response/app_binary";

export function uploadAppBinary(data: UploadAppBinaryRequest,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) {
  return axiosClient.post<AppBinary>(`/storage/api/v1/app/binary`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Accept": "*/*"
    },
    onUploadProgress
  });
}

export function uploadAppBinaryUnwrapped(data: UploadAppBinaryRequest,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) {
  return uploadAppBinary(data, onUploadProgress).then(x => x.data);
}