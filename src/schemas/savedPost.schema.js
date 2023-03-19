const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const savedPostSchema = {
  idSchema: Joi.object({
    id: Joi.objectid().required(),
  }),
};

module.exports = savedPostSchema;
