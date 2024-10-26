import Joi from 'joi';

export const createCategoryDto = Joi.object({
  title: Joi.string().min(1).required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(1).optional().messages({
    'string.base': 'Description must be a string',
  }),
});

export const updateCategoryDto = Joi.object({
  title: Joi.string().min(1).optional().messages({
    'string.empty': 'Title is required',
  }),
  description: Joi.string().min(1).optional().messages({
    'string.base': 'Description must be a string',
  }),
}).min(1);
