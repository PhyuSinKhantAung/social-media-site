const Joi = require('joi');

const postSchema = {
  createPostSchema: Joi.object({
    content: Joi.string(),
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
  }),
};

module.exports = postSchema;
