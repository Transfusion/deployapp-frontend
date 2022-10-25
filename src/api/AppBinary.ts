import axiosClient from "./client";
import { AppBinary } from "./interfaces/response/app_binary";
import { AppBinaryAsset } from "./interfaces/response/app_binary_asset";
import { AppBinaryJob } from "./interfaces/response/app_binary_job";
import { GenerateAssetResult } from "./interfaces/response/generate_asset";
import PagingSortingSpring from "./interfaces/response/paging_sorting_spring";

export function getBinaries(page: Number, size = 15,
  search?: { key: string, operation: string, value: string }[],
  sort?: { key: string, direction: string }[],
  types?: string[]) {
  let params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());
  if (sort !== undefined) {
    for (let { key, direction } of sort) {
      params.append("sort", `${key},${direction}`);
    }
  }

  if (search !== undefined) {
    for (let { key, operation, value } of search) {
      params.append("searchKey", key);
      params.append("searchOperation", operation);
      params.append("searchValue", value);
    }
  }

  if (types !== undefined) {
    for (let type of types) {
      params.append("types", type);
    }
  }

  return axiosClient.get<PagingSortingSpring<AppBinary>>("/storage/api/v1/app/binary", { params })

}

export function getUnwrappedBinaries(page: Number, size = 15,
  search?: { key: string, operation: string, value: string }[],
  sort?: { key: string, direction: string }[],
  types?: string[]) {
  return getBinaries(page, size, search, sort, types).then(resp => resp.data);
}

export function getBinary(id: string) {
  return axiosClient.get<AppBinary>(`/storage/api/v1/app/binary/${id}`);
}

export function getUnwrappedBinary(id: string) {
  return getBinary(id).then(resp => resp.data);
}

export function generateAsset(id: string, type: string) {
  return axiosClient.post<GenerateAssetResult>(`/storage/api/v1/app/binary/${id}/generateAsset`, {
    type
  });
}

export function generateAssetUnwrapped(id: string, type: string) {
  return generateAsset(id, type).then(resp => resp.data);
}

export function getJobs(id: string) {
  return axiosClient.get<AppBinaryJob[]>(`/storage/api/v1/app/binary/${id}/jobs`);
}

export function getUnwrappedJobs(id: string) {
  return getJobs(id).then(resp => resp.data);
}

export function getAssets(id: string) {
  return axiosClient.get<AppBinaryAsset[]>(`/storage/api/v1/app/binary/${id}/assets`);
}

export function getUnwrappedAssets(id: string) {
  return getAssets(id).then(resp => resp.data);
}

export function updateAppBinaryDescription(id: string, description: string) {
  return axiosClient.put<AppBinary>(`/storage/api/v1/app/binary/${id}/description`, {
    description
  });
}