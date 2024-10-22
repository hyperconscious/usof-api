import * as Joi from 'joi';

export interface AuthorFilter {
  id: number;
}

export interface Filters {
  categories?: string | string[];
  postId?: number;
  status?: 'active' | 'inactive';
  postAuthor?: AuthorFilter;
}

export interface QueryOptions {
  page: number;
  limit: number;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  filters?: Filters;
}

export const QueryOptionsDto = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortField: Joi.string().optional(),
  sortDirection: Joi.string().uppercase().valid('ASC', 'DESC').default('ASC'),
  filters: Joi.object({
    categories: Joi.alternatives()
      .try(
        Joi.string().pattern(/^[a-zA-Z0-9,]+$/),
        Joi.array().items(Joi.string().alphanum()),
      )
      .optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    postAuthor: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }).optional(),
  }).optional(),
});
