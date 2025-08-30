export interface TableResponse<T> {
    rows: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    sortOrder: number;
    sortField: string;
}