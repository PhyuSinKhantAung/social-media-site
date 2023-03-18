const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const commentSchema = {
  postIdSchema: Joi.object({
    postId: Joi.objectid().required(),
  }),
  commentIdSchema: Joi.object({
    commentId: Joi.objectid().required(),
  }),
  createComment: Joi.object({
    text: Joi.string().required(),
  }),
  updateComment: Joi.object({
    text: Joi.string(),
  }),
};

module.exports = commentSchema;
