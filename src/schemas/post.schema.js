const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const postSchema = {
  idSchema: Joi.object({
    id: Joi.objectid(),
    userId: Joi.objectid(),
  }),
  postSchema: Joi.object({
    content: Joi.string(),

    images: Joi.array().items(Joi.string().uri()),

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
  deletedImageSchema: Joi.object({
    deletedImages: Joi.array()
      .items(Joi.objectid())
      .unique()
      .optional()
      .required()
      .messages({ 'array.unique': 'You cannot delete duplicate image id.' }),
  }),
};

module.exports = postSchema;
