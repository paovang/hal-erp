export interface StandardResponseData<T> {
  data: T;
  status?: [];
  message?: string;
}

export interface PaginatedResponseData<T> extends StandardResponseData<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface CursorPaginatedResponseData<T>
  extends StandardResponseData<T[]> {
  pagination: {
    limit: number;
    next_cursor: string;
    previous_cursor: string;
  };
}

export type ResponseDataType<T> =
  | StandardResponseData<T>
  | PaginatedResponseData<T>
  | CursorPaginatedResponseData<T>;
