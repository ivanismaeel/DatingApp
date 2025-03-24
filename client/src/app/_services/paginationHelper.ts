import {HttpParams, HttpResponse} from "@angular/common/http"
import {signal} from "@angular/core"

import {PaginatedResponse} from "../_models/pagination"

export function setPaginationHeaders (pageNumber: number, pageSize: number) {
    let params = new HttpParams()

    if (pageNumber != null && pageSize != null)
    {
        params = params.append('pageNumber', pageNumber)
        params = params.append('pageSize', pageSize)
    }

    return params
}

export function setPaginatedResponse<T> (
    response: HttpResponse<T>,
    paginatedResponseSignal: ReturnType<typeof signal<PaginatedResponse<T> | null>>
) {
    paginatedResponseSignal.set({
        items: response.body as T,
        pagination: JSON.parse(response.headers.get('Pagination')!)
    })
}