import Joi from 'joi';
import { auth } from '../middlewares/auth.middleware';

export const createPostDto = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    'string.base': 'Title must be a string.',
    'string.empty': 'Title cannot be empty.',
    'string.min': 'Title must be at least 3 characters long.',
    'string.max': 'Title cannot exceed 255 characters.',
    'any.required': 'Title is required.',
  }),

  content: Joi.string().min(10).required().messages({
    'string.base': 'Content must be a string.',
    'string.empty': 'Content cannot be empty.',
    'string.min': 'Content must be at least 10 characters long.',
    'any.required': 'Content is required.',
  }),

  images: Joi.array().optional().messages({
    'array.base': 'Images must be an array.',
  }),
  categories: Joi.array()
    .items(Joi.string().required())
    .required()
    .unique()
    .min(1)
    .messages({
      'array.base': 'Categories must be an array.',
      'array.min': 'At least one category is required.',
    }),

  status: Joi.string()
    .valid('active', 'inactive', 'locked')
    .default('active')
    .messages({
      'string.base': 'Status must be a string.',
      'any.only': 'Status must be either active or inactive.',
    }),

  author: Joi.object({
    id: Joi.number().required().messages({
      'number.base': 'Author ID must be a number.',
      'any.required': 'Author ID is required.',
    }),
  }).required(),

  publishDate: Joi.date()
    .default(() => new Date())
    .messages({
      'date.base': 'Publish date must be a valid date.',
    }),
});

export const updatePostDto = Joi.object({
  title: Joi.string().min(3).max(255).optional().messages({
    'string.base': 'Title must be a string.',
    'string.empty': 'Title cannot be empty.',
    'string.min': 'Title must be at least 3 characters long.',
    'string.max': 'Title cannot exceed 255 characters.',
  }),

  content: Joi.string().min(10).optional().messages({
    'string.base': 'Content must be a string.',
    'string.empty': 'Content cannot be empty.',
    'string.min': 'Content must be at least 10 characters long.',
  }),

  images: Joi.array().optional().messages({
    'array.base': 'Images must be an array.',
  }),
  categories: Joi.array()
    .items(Joi.string().required())
    .required()
    .unique()
    .min(1)
    .optional()
    .messages({
      'array.base': 'Categories must be an array.',
      'array.min': 'At least one category is required.',
    }),

  status: Joi.string()
    .valid('active', 'inactive', 'locked')
    .optional()
    .messages({
      'string.base': 'Status must be a string.',
      'any.only': 'Status must be either active or inactive.',
    }),

  publishDate: Joi.date().optional().messages({
    'date.base': 'Publish date must be a valid date.',
  }),
}).min(1);
