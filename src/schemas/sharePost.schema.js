const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const sharePostSchema = {
  idSchema: Joi.object({
    id: Joi.objectid().required(),
  }),

  sharePost: Joi.object({
    caption: Joi.string(),
    taggedUserIds: Joi.array()
      .items(
        Joi.string()
          .length(24)
          .messages({ 'string.length': 'Tagged user id is invalid.' })
          .hex()
      )
      .unique()
      .optional()
      .messages({ 'array.unique': 'You cannot tag duplicate user id.' }),

    audience: Joi.string().valid('PUBLIC', 'FRIENDS'),
  }),
};

module.exports = sharePostSchema;
