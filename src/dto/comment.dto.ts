import * as Joi from 'joi';

export const createCommentDto = Joi.object({
  content: Joi.string().min(1).required().messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
});

export const updateCommentDto = Joi.object({
  content: Joi.string().min(1).optional().messages({
    'string.empty': 'Content cannot be empty',
  }),
});
