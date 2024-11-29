import { Filters, QueryOptions } from '../dto/query-options.dto';
export class Paginator<T> {
  private queryOptions: QueryOptions;

  constructor(paginationOptions: QueryOptions) {
    this.queryOptions = {
      page: paginationOptions.page || 1,
      limit: paginationOptions.limit || 10,
      sortField: paginationOptions.sortField || 'id',
      sortDirection: paginationOptions.sortDirection || 'ASC',
      filters: paginationOptions.filters || {},
      search: paginationOptions.search || '',
      searchType: paginationOptions.searchType || 'user',
    };
  }

  public async paginate(
    queryBuilder: any,
  ): Promise<{ items: T[]; total: number }> {
    Object.keys(this.queryOptions.filters || {}).forEach((filterKey) => {
      const filterValue = (this.queryOptions.filters ?? {})[
        filterKey as keyof Filters
      ];

      if (filterKey === 'dateRange' && typeof filterValue === 'string') {
        const [startDate, endDate] = filterValue
          .split(',')
          .map((date) => date.trim());
        queryBuilder.andWhere('publishDate BETWEEN :startDate AND :endDate', {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        });
      } else if (
        filterKey === 'categories' &&
        typeof filterValue === 'string'
      ) {
        const categories = filterValue.split(',');
        queryBuilder.andWhere('category.title IN (:...categories)', {
          categories,
        });
      } else if (
        filterKey === 'status' &&
        this.queryOptions.searchType === 'comment'
      ) {
        queryBuilder.andWhere('comment.status = :status', {
          status: filterValue,
        });
      } else if (Array.isArray(filterValue)) {
        queryBuilder.andWhere(`${filterKey} IN (:...${filterKey})`, {
          [filterKey]: filterValue,
        });
      } else if (typeof filterValue === 'object' && filterValue !== null) {
        // palka
        if (filterKey === 'postAuthor') {
          queryBuilder.andWhere(`author.id = :id`, {
            id: filterValue.id,
          });
        }
      } else {
        queryBuilder.andWhere(`${filterKey} = :${filterKey}`, {
          [filterKey]: filterValue,
        });
      }
    });

    if (this.queryOptions.search) {
      const searchTerm = this.queryOptions.search.toString();
      if (this.queryOptions.searchType === 'post') {
        queryBuilder.andWhere('post.title LIKE :searchTermStart', {
          searchTerm: `${searchTerm}%`,
        });
      } else if (this.queryOptions.searchType === 'user') {
        queryBuilder.andWhere(
          'user.login LIKE :searchTerm OR user.full_name LIKE :searchTermFull',
          {
            searchTermFull: `%${searchTerm}%`,
            searchTerm: `${searchTerm}%`,
          },
        );
      } else if (this.queryOptions.searchType === 'category') {
        queryBuilder.andWhere('category.title LIKE :searchTerm', {
          searchTerm: `${searchTerm}%`,
        });
      }
    }

    const total = await queryBuilder.getCount();
    queryBuilder.orderBy(
      this.queryOptions.sortField,
      this.queryOptions.sortDirection,
    );

    if (this.queryOptions.limit > 0) {
      queryBuilder
        .limit(this.queryOptions.limit)
        .offset((this.queryOptions.page - 1) * this.queryOptions.limit);
    }

    const items = await queryBuilder.getMany();

    return { items, total: total };
  }
}
export { QueryOptions };
