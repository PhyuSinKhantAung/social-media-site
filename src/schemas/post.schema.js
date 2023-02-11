const Joi = require('joi');

const postSchema = {
  createPostSchema: Joi.object({
    content: Joi.string(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    taggedUserIds: Joi.array()
      .items(Joi.string().length(24).hex())
      .unique()
      .optional(),
  }),
};

module.exports = postSchema;
