interface PaginatedResponseMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginatedResponseMeta;
}

export function paginatedResponse<T>(data: T[], page: number, take: number, total: number): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / take);
    return {
        data,
        meta: {
            totalItems: total,
            itemCount: data.length,
            itemsPerPage: take,
            totalPages: totalPages,
            currentPage: page,
        },
    };
}