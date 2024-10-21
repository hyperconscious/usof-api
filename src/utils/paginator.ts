export interface QueryOptions {
  page: number;
  limit: number;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  filters?: Record<string, string | string[]>;
}

export class Paginator<T> {
  private page: number;
  private limit: number;
  private sortField: string;
  private sortDirection: 'ASC' | 'DESC';
  private filters: Record<string, string | string[]>;

  constructor(paginationOptions: QueryOptions) {
    this.page = paginationOptions.page || 1;
    this.limit = paginationOptions.limit || 10;
    this.sortField = paginationOptions.sortField || 'id';
    this.sortDirection = paginationOptions.sortDirection || 'ASC';
    this.filters = paginationOptions.filters || {};
  }

  public async paginate(
    queryBuilder: any,
  ): Promise<{ data: T[]; total: number }> {
    Object.keys(this.filters).forEach((filterKey) => {
      const filterValue = this.filters[filterKey];

      if (Array.isArray(filterValue)) {
        queryBuilder.andWhere(`${filterKey} IN (:...${filterKey})`, {
          [filterKey]: filterValue,
        });
      } else {
        queryBuilder.andWhere(`${filterKey} = :${filterKey}`, {
          [filterKey]: filterValue,
        });
      }
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
