import axiosClient from "./client"
import { CreateFtpCredentialRequest } from "./interfaces/request/create_ftp_credential"
import { CreateS3CredentialRequest } from "./interfaces/request/create_s3_credential"
import { UpdateFtpCredentialRequest } from "./interfaces/request/update_ftp_credential"
import { UpdateS3CredentialRequest } from "./interfaces/request/update_s3_credential"
import { CreateFtpCredentialResponse } from "./interfaces/response/create_ftp_credential"
import { CreateS3CredentialResponse } from "./interfaces/response/create_s3_credential"
import PagingSortingSpring from "./interfaces/response/paging_sorting_spring"
import S3RegionsResponse from "./interfaces/response/s3_regions_response"
import { StorageCredential } from "./interfaces/response/storage_credential"
import { UpdateFtpCredentialResponse } from "./interfaces/response/update_ftp_credential"
import { UpdateS3CredentialResponse } from "./interfaces/response/update_s3_credential"

export function getS3Regions() {
    return axiosClient.get<S3RegionsResponse>("/api/v1/utility/public/S3Regions", {
    });
}


/**
 * 
 * @returns {
    "content": [
        {
            "server": "100",
            "accessKey": "af",
            "secretKey": "d",
            "bucket": "ds",
            "id": "25870ffc-02a6-4b40-8e55-24434ec06d2d",
            "name": "ds",
            "createdOn": "2022-08-05T06:22:40.408629Z",
            "checkedOn": "2022-08-05T06:22:40.408629Z",
            "lastUsed": null,
            "type": "S3"
        },
        {
            "server": "argea",
            "accessKey": "af",
            "secretKey": "d",
            "bucket": "ds",
            "id": "e663005f-4b50-4db8-82c8-4b5e48ebc56d",
            "name": "ds",
            "createdOn": "2022-08-05T13:55:33.831856Z",
            "checkedOn": "2022-08-05T13:55:33.831856Z",
            "lastUsed": null,
            "type": "S3"
        },
        {
            "server": "argea",
            "accessKey": "af",
            "secretKey": "d",
            "bucket": "ds",
            "id": "2fe69f5d-6806-4467-8ad5-0f7d227aa771",
            "name": "ds",
            "createdOn": "2022-08-05T13:59:07.559442Z",
            "checkedOn": "2022-08-05T13:59:07.559442Z",
            "lastUsed": null,
            "type": "S3"
        }
    ],
    "pageable": {
        "sort": {
            "empty": true,
            "unsorted": true,
            "sorted": false
        },
        "offset": 0,
        "pageNumber": 0,
        "pageSize": 10,
        "paged": true,
        "unpaged": false
    },
    "last": true,
    "totalElements": 3,
    "totalPages": 1,
    "number": 0,
    "first": true,
    "sort": {
        "empty": true,
        "unsorted": true,
        "sorted": false
    },
    "size": 10,
    "numberOfElements": 3,
    "empty": false
}
 */
export function getStorageCredentials(page: Number, size = 15, sort?: { key: string, direction: string }[], name?: string, types?: string[]) {
    let params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (sort !== undefined) {
        for (let { key, direction } of sort) {
            params.append("sort", `${key},${direction}`);
        }
    }

    if (types !== undefined) {
        for (let type of types) {
            params.append("types", type);
        }
    }

    if (!!name)
        params.append("name", name)

    return axiosClient.get<PagingSortingSpring<StorageCredential>>("/api/v1/credentials", { params })
}

export function getUnwrappedStorageCredentials(page: Number, size = 15, sort?: { key: string, direction: string }[], name?: string, types?: string[]) {
    return getStorageCredentials(page, size, sort, name, types).then(resp => resp.data);
}

export function deleteS3Credential(id: string) {
    return axiosClient.delete<void>(`/api/v1/credentials/S3/${id}`);
}

export function createS3Credential(data: CreateS3CredentialRequest) {
    return axiosClient.post<CreateS3CredentialResponse>("/api/v1/credentials/S3", data);
}


export function updateS3Credential(id: string, data: UpdateS3CredentialRequest) {
    return axiosClient.put<UpdateS3CredentialResponse>(`/api/v1/credentials/S3/${id}`, data);
}

export function deleteFtpCredential(id: string) {
    return axiosClient.delete<void>(`/api/v1/credentials/FTP/${id}`);
}

export function createFtpCredential(data: CreateFtpCredentialRequest) {
    return axiosClient.post<CreateFtpCredentialResponse>("/api/v1/credentials/FTP", data);
}

export function updateFtpCredential(id: string, data: UpdateFtpCredentialRequest) {
    return axiosClient.put<UpdateFtpCredentialResponse>(`/api/v1/credentials/FTP/${id}`, data);
}
