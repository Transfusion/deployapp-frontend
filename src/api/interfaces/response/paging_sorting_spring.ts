/*
{
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

interface SortingSpring {
  empty: boolean,
  unsorted: boolean,
  sorted: boolean,
}

interface PagingSortingSpring<T> {
  content: T[],
  pageable: {
    sort: SortingSpring,
    offset: number,
    pageNumber: number,
    pageSize: number,
    paged: boolean,
    unpaged: boolean
  },
  last: boolean,
  totalElements: number,
  totalPages: number,
  number: number,
  first: boolean,
  sort: SortingSpring,
  size: number,
  numberOfElements: number,
  empty: boolean
}

export default PagingSortingSpring