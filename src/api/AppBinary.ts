import axiosClient from "./client"
import { AppBinary } from "./interfaces/response/app_binary";
import PagingSortingSpring from "./interfaces/response/paging_sorting_spring";

export function getBinaries(page: Number, size = 15,
  search?: { key: string, operation: string, value: string }[],
  sort?: { key: string, direction: string }[]) {
  let params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());
  if (sort !== undefined) {
    for (let { key, direction } of sort) {
      params.append("sort", `${key},${direction}`);
    }
  }

  if (search && search.length) {
    for (let { key, operation, value } of search) {
      params.append("searchKey", key);
      params.append("searchOperation", operation);
      params.append("searchValue", value);
    }
  }

  return axiosClient.get<PagingSortingSpring<AppBinary>>("/storage/api/v1/app/binary", { params })

}

export function getUnwrappedBinaries(page: Number, size = 15,
  search?: { key: string, operation: string, value: string }[],
  sort?: { key: string, direction: string }[]) {
  return getBinaries(page, size, search, sort).then(resp => resp.data);
}