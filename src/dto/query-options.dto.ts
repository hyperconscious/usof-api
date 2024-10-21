import * as Joi from 'joi';

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
  }).optional(),
});
