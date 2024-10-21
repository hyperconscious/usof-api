import * as Joi from 'joi';

export const CreateCommentDto = Joi.object({
  authorId: Joi.number().integer().required().messages({
    'number.base': 'Author ID must be a number',
    'any.required': 'Author ID is required',
  }),
  postId: Joi.number().integer().required().messages({
    'number.base': 'Post ID must be a number',
    'any.required': 'Post ID is required',
  }),
  content: Joi.string().min(1).required().messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
});

export const UpdateCommentDto = Joi.object({
  content: Joi.string().min(1).optional().messages({
    'string.empty': 'Content cannot be empty',
  }),
});
