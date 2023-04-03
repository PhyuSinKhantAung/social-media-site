const route = require('express').Router();
const commentController = require('../controllers/comment.controller');
const authenticate = require('../middlewares/authenticate');
const { validateBody, validateParams } = require('../middlewares/validation');
const commentSchema = require('../schemas/comment.schema');

route.post(
  '/:postId',
  authenticate,
  validateParams(commentSchema.postIdSchema),
  validateBody(commentSchema.createComment),
  commentController.createComment
);

route.get(
  '/:postId',
  authenticate,
  validateParams(commentSchema.postIdSchema),
  commentController.getAllComments
);

route.patch(
  '/:commentId',
  authenticate,
  validateParams(commentSchema.commentIdSchema),
  validateBody(commentSchema.updateComment),
  commentController.updateComment
);

route.delete(
  '/:postId/:commentId',
  validateParams(commentSchema.postIdSchema),
  validateParams(commentSchema.commentIdSchema),
  authenticate,
  commentController.deleteComment
);

module.exports = route;
