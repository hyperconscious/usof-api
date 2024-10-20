export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface FilterOptions {
  [key: string]: any;
}

export class Paginator<T> {
  private page: number;
  private limit: number;
  private sortField: string;
  private sortDirection: 'ASC' | 'DESC';
  private filters: FilterOptions;

  constructor(
    paginationOptions: PaginationOptions,
    sortOptions?: SortOptions,
    filters?: FilterOptions,
  ) {
    this.page = paginationOptions.page || 1;
    this.limit = paginationOptions.limit || 10;
    this.sortField = sortOptions?.field || 'id';
    this.sortDirection = sortOptions?.direction || 'ASC';
    this.filters = filters || {};
  }

  public async paginate(
    queryBuilder: any,
  ): Promise<{ data: T[]; total: number }> {
    Object.keys(this.filters).forEach((filterKey) => {
      queryBuilder.where(filterKey, this.filters[filterKey]);
    });

    const total = await queryBuilder.getCount();
    queryBuilder.orderBy(this.sortField, this.sortDirection);
    const data = await queryBuilder
      .limit(this.limit)
      .offset((this.page - 1) * this.limit)
      .getRawMany();

    return { data, total: total };
  }
}
