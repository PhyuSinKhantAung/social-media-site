const Joi = require('joi');

const userSchemas = {
  signupUserSchema: Joi.object({
    name: Joi.string().trim().min(3).max(30).required().messages({
      'any.required': 'Your name must be string with min length of 3',
    }),
    phone: Joi.alternatives()
      .try(Joi.number().min(10), Joi.string().min(10))
      .messages({
        'string.min':
          'Your phone number must be min of 10 and must be provided',
      }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .lowercase(),
    password: Joi.string().trim().min(6).required().strict().messages({
      'any.required': 'Your password must be provided',
    }),
    dob: Joi.date()
      .max('01-01-2004')
      .iso()
      .messages({
        'date.format': `Date format is YYYY-MM-DD`,
        'date.max': `Age must be 18+`,
      })
      .options({ convert: true })
      .required(),
    gender: Joi.string().valid('male', 'female'),
  })
    .xor('phone', 'email')
    .messages({
      'object.missing': 'Email or phone number must be provided.',
    }),

  loginUserSchema: Joi.object({
    phone: Joi.alternatives()
      .try(Joi.number().min(10), Joi.string().min(10))
      .messages({
        'string.min':
          'Your phone number must be min of 10 and must be provided',
      }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .lowercase(),
    password: Joi.string().trim().min(6).strict().messages({
      'any.required': 'Your password must be provided',
    }),
  })
    .xor('phone', 'email')
    .and('email', 'password')
    .without('phone', ['password'])
    .messages({
      'object.missing': 'Email or phone number must be provided.',
      'object.and': 'You must provide both email and password',
    }),
};

module.exports = userSchemas;
