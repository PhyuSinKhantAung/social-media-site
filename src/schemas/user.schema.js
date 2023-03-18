const Joi = require('joi');

const userSchemas = {
  signupUserSchema: Joi.object({
    username: Joi.string().trim().min(3).max(30).required().messages({
      'any.required': 'Your name must be string with min length of 3',
    }),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .lowercase()
      .required()
      .messages({ 'any.required': 'You must provide your email.' }),

    password: Joi.string().trim().min(6).required().strict().messages({
      'any.required': 'You must provide your password.',
    }),

    dob: Joi.date()
      .max('01-01-2005')
      .iso()
      .messages({
        'date.format': `Date format is YYYY-MM-DD`,
        'date.max': `Age must be 18+`,
      })
      .options({ convert: true })
      .required(),

    gender: Joi.string().valid('male', 'female', 'others').required(),
  }),

  loginUserSchema: Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .lowercase()
      .required()
      .messages({ 'any.required': 'You must provide your email.' }),

    password: Joi.string().required().messages({
      'any.required': 'You must provide your password.',
    }),
  }),

  forgotPasswordSchema: Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .lowercase()
      .required()
      .messages({ 'any.required': 'You must provide your email.' }),
  }),

  resetPasswordSchema: Joi.object({
    otp: Joi.string().min(6).max(6),
    password: Joi.string().required().messages({
      'any.required': 'You must provide your password.',
    }),
  }),
};

module.exports = userSchemas;
