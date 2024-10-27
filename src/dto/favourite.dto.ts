import * as Joi from 'joi';

export const createFavouriteDto = Joi.object({
  post: Joi.number().required(),
});
