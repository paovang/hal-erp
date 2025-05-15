export class BaseApiResponse<T> {
  data: T;
  message?: string;
  status_code: number;
}

export class BaseApiPaginatedResponse<T> extends BaseApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export class BaseApiCursorPaginatedResponse<T> extends BaseApiResponse<T[]> {
  pagination: {
    limit: number;
    next_cursor: string;
    previous_cursor: string;
  };
}

export type ApiResponse<T> =
  | BaseApiResponse<T>
  | BaseApiPaginatedResponse<T>
  | BaseApiCursorPaginatedResponse<T>;
