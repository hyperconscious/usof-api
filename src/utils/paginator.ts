import { Filters, QueryOptions } from '../dto/query-options.dto';

export class Paginator<T> {
  private page: number;
  private limit: number;
  private sortField: string;
  private sortDirection: 'ASC' | 'DESC';
  private filters: Filters;
  private search: string;

  constructor(paginationOptions: QueryOptions) {
    this.page = paginationOptions.page || 1;
    this.limit = paginationOptions.limit || 10;
    this.sortField = paginationOptions.sortField || 'id';
    this.sortDirection = paginationOptions.sortDirection || 'ASC';
    this.filters = paginationOptions.filters || {};
    this.search = paginationOptions.search || '';
  }

  public async paginate(
    queryBuilder: any,
  ): Promise<{ data: T[]; total: number }> {
    Object.keys(this.filters).forEach((filterKey) => {
      const filterValue = this.filters[filterKey as keyof Filters];

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

    if (this.search) {
      const searchTerm = this.search.toString();
      queryBuilder.andWhere(
        'post.title LIKE :searchTerm OR post.content LIKE :searchTerm',
        {
          searchTerm: `%${searchTerm}%`,
        },
      );
    }

    const total = await queryBuilder.getCount();
    queryBuilder.orderBy(this.sortField, this.sortDirection);
    const data = await queryBuilder
      .limit(this.limit)
      .offset((this.page - 1) * this.limit)
      .getMany();

    return { data, total: total };
  }
}
export { QueryOptions };
