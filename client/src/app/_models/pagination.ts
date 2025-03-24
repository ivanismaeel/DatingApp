export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    items?: T;
    pagination?: Pagination;
}