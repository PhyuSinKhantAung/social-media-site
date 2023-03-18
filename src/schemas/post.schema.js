const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const postSchema = {
  idSchema: Joi.object({
    id: Joi.objectid().required(),
  }),
  postSchema: Joi.object({
    content: Joi.string().max(200),

    images: Joi.array().items(Joi.string().uri()).optional(),

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
