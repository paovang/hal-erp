import { Injectable } from '@nestjs/common';
import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  CursorPaginationInput,
  CursorPaginationResult,
  FilterOptions,
  IPaginationService,
  PaginatedResult,
  PaginationInput,
  StandardPaginationInput,
  StandardPaginationResult,
  StatusAmount,
} from '@common/infrastructure/pagination/pagination.interface';

@Injectable()
export class PaginationService implements IPaginationService {
  private isCursorPaginationInput(
    input: PaginationInput,
  ): input is CursorPaginationInput {
    return input.use_cursor;
  }

  async paginate<OrmEntity extends ObjectLiteral, Entity>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    mapper: (item: OrmEntity) => Entity,
    filterOptions?: FilterOptions,
    status?: StatusAmount[] | null,
  ): Promise<PaginatedResult<Entity> | Entity[]> {
    this.applyFilters(queryBuilder, paginationInput, filterOptions);
    if (!paginationInput.limit) {
      const data = await queryBuilder
        .orderBy(
          this.getValidSortValue('id', paginationInput.sort_by),
          this.getValidSortValue('DESC', paginationInput.sort_order),
        )
        .getMany();
      return data.map(mapper);
    }

    if (this.isCursorPaginationInput(paginationInput)) {
      return this.cursorPaginate(queryBuilder, paginationInput, mapper, status);
    } else {
      return this.standardPaginate(
        queryBuilder,
        paginationInput,
        mapper,
        status,
      );
    }
  }

  private applyFilters<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    filterOptions?: FilterOptions,
  ): void {
    if (filterOptions) {
      this.filterBySearchColumn(
        queryBuilder,
        paginationInput,
        filterOptions.searchColumns,
      );
      this.filterByDate(
        queryBuilder,
        paginationInput,
        filterOptions.dateColumn,
      );
      this.filterByColumns(
        queryBuilder,
        paginationInput,
        filterOptions.filterByColumns,
      );
    }
  }

  private filterBySearchColumn<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    searchColumns?: string[],
  ): void {
    const searchValue = (paginationInput as any).search;
    if (searchValue && searchColumns && searchColumns.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          searchColumns.forEach((column) => {
            qb.orWhere(`${column} ILIKE :searchValue`, {
              searchValue: `%${searchValue}%`,
            });
          });
        }),
      );
    }
  }

  private filterByDate<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    dateColumn?: string,
  ): void {
    if (!dateColumn) return;

    const startDate = (paginationInput as any).start_date;
    const endDate = (paginationInput as any).end_date;

    if (startDate && endDate) {
      queryBuilder.andWhere(
        `DATE(${dateColumn}) BETWEEN :startDate AND :endDate`,
        {
          startDate,
          endDate,
        },
      );
    }
  }

  private filterByColumns<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    filterByColumns?: string[],
  ): void {
    if (!filterByColumns) return;
    filterByColumns.forEach((column) => {
      const parameter = column.split('.')[1] || column;
      if ((paginationInput as any)[parameter]) {
        queryBuilder.andWhere(`${column} = :${parameter}`, {
          [parameter]: (paginationInput as any)[parameter],
        });
      }
    });
  }

  private async standardPaginate<OrmEntity extends ObjectLiteral, Entity>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    {
      limit = 10,
      page = 1,
      sort_by = 'id',
      sort_order = 'DESC',
    }: StandardPaginationInput,
    mapper: (item: OrmEntity) => Entity,
    status?: StatusAmount[] | null,
  ): Promise<StandardPaginationResult<Entity>> {
    const total = await queryBuilder.getCount();
    const total_pages = Math.ceil(total / limit);
    page = Math.max(1, Math.min(page, total_pages));

    const [data, totalData] = await queryBuilder
      .orderBy(
        this.getValidSortValue('id', sort_by),
        this.getValidSortValue('DESC', sort_order),
      )
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    console.log('data', status);
    return {
      status: status,
      data: data.map(mapper),
      pagination: {
        total: totalData,
        total_pages,
        limit,
        page,
      },
    };
  }

  private async cursorPaginate<OrmEntity extends ObjectLiteral, Entity>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    {
      limit = 10,
      next_cursor,
      previous_cursor,
      sort_by = 'id',
      sort_order = 'DESC',
    }: CursorPaginationInput,
    mapper: (item: OrmEntity) => Entity,
    status?: StatusAmount[] | null,
  ): Promise<CursorPaginationResult<Entity>> {
    const isBackward = Boolean(previous_cursor);
    this.applyCursorPagination(queryBuilder, {
      use_cursor: true,
      limit,
      next_cursor,
      previous_cursor,
      sort_by,
      sort_order,
    });

    // Fetch one extra item to determine if there are more pages
    const data = await queryBuilder.take(limit + 1).getMany();
    const hasMoreItems = data.length > limit;

    if (hasMoreItems) {
      data.pop(); // Remove the extra item
    }

    // If navigating backward, reverse the order of results
    const resultData = isBackward ? data.reverse() : data;

    let newNextCursor: string | null = null;
    let newPreviousCursor: string | null = null;

    if (resultData.length > 0) {
      const firstItem = resultData[0]['id'].toString();
      const lastItem = resultData[resultData.length - 1]['id'].toString();

      if (isBackward) {
        newNextCursor = lastItem;
        newPreviousCursor = hasMoreItems ? firstItem : null;
      } else {
        newNextCursor = hasMoreItems ? lastItem : null;
        newPreviousCursor = next_cursor ? firstItem : null;
      }
    }

    return {
      status: status,
      data: resultData.map(mapper),
      pagination: {
        limit,
        next_cursor: newNextCursor,
        previous_cursor: newPreviousCursor,
      },
    };
  }

  private applyCursorPagination<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    {
      next_cursor,
      previous_cursor,
      sort_by,
      sort_order,
    }: CursorPaginationInput,
  ) {
    const cursorField = this.getValidSortValue('id', sort_by);
    const order = this.getValidSortValue('DESC', sort_order);

    if (next_cursor) {
      queryBuilder.andWhere(
        `${cursorField} ${order === 'ASC' ? '>' : '<'} :next_cursor`,
        {
          next_cursor,
        },
      );
    }

    if (previous_cursor) {
      queryBuilder.andWhere(
        `${cursorField} ${order === 'ASC' ? '<' : '>'} :previous_cursor`,
        {
          previous_cursor,
        },
      );
      queryBuilder.addOrderBy(cursorField, order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      queryBuilder.addOrderBy(cursorField, order);
    }
  }

  private getValidSortValue(defaultValue: string, value?: any): any {
    return value && value.trim() !== '' ? value : defaultValue;
  }
}
