const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const likeSchema = {
  idSchema: Joi.object({
    id: Joi.objectid().required(),
  }),
};

module.exports = likeSchema;
