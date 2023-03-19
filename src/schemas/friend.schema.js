const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const friendSchema = {
  idSchema: Joi.object({
    id: Joi.objectid().required(),
  }),
};

module.exports = friendSchema;
