import Joi from 'joi';

export const createUserDto = Joi.object({
  login: Joi.string().min(4).max(20).required().messages({
    'string.min': 'Login must be at least 4 characters long.',
    'string.max': 'Login must be at most 20 characters long.',
    'any.required': 'Login is required.',
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      'any.required': 'Password is required.',
    }),

  full_name: Joi.string()
    .optional()
    .pattern(
      /^[A-ZА-Я][a-zа-яё]+ [A-ZА-Я][a-zа-яё]+$/,
      'two words with initial uppercase letters',
    )
    .messages({
      'string.pattern.name':
        'Full name must consist of two words, each starting with a capital letter.',
    }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),

  verified: Joi.boolean().default(false),

  avatar: Joi.string().optional().allow(null, ''),

  role: Joi.string().valid('admin', 'user').default('user').messages({
    'any.only': 'Role must be either admin or user.',
  }),
});

export const updateUserDto = Joi.object({
  login: Joi.string().min(4).max(20).messages({
    'string.min': 'Login must be at least 4 characters long.',
    'string.max': 'Login must be at most 20 characters long.',
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    }),

  full_name: Joi.string()
    .pattern(
      /^[A-ZА-Я][a-zа-яё]+ [A-ZА-Я][a-zа-яё]+$/,
      'two words with initial uppercase letters',
    )
    .messages({
      'string.pattern.name':
        'Full name must consist of two words, each starting with a capital letter.',
    }),

  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address.',
  }),

  verified: Joi.boolean().default(false),

  avatar: Joi.string().optional().allow(null, ''),

  role: Joi.string().valid('admin', 'user').default('user').messages({
    'any.only': 'Role must be either admin or user.',
  }),
}).min(1);
