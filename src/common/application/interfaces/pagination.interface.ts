import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

type SortOrder = 'ASC' | 'DESC';

export interface StandardPaginationInput {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_order?: SortOrder;
  use_cursor: false;
}

export interface CursorPaginationInput {
  limit?: number;
  use_cursor: true;
  next_cursor?: string | null;
  previous_cursor?: string | null;
  sort_by?: string;
  sort_order?: SortOrder;
}

export type PaginationInput = StandardPaginationInput | CursorPaginationInput;

export interface StandardPaginationResult<Entity> {
  data: Entity[];
  pagination: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  };
}

export interface CursorPaginationResult<Entity> {
  data: Entity[];
  pagination: {
    limit: number;
    next_cursor: string | null;
    previous_cursor: string | null;
  };
}

export interface FilterOptions {
  searchColumns?: string[];
  filterByColumns?: string[];
  dateColumn?: string;
}

export type PaginatedResult<Entity> =
  | StandardPaginationResult<Entity>
  | CursorPaginationResult<Entity>;

export type ResponseResult<Entity> =
  | PaginatedResult<Entity>
  | Entity[]
  | Entity
  | null;

export interface IPaginationService {
  paginate<T extends ObjectLiteral, Entity>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationInput: PaginationInput,
    mapper: (item: T) => Entity,
    filterOptions?: FilterOptions,
  ): Promise<PaginatedResult<Entity> | Entity[]>;
}
