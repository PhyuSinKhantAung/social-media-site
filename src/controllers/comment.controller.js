const catchAsync = require('../utilities/catchAsync');
const commentService = require('../services/comment.service');
const successResponse = require('../utilities/successResponse');

const commentController = {
  createComment: catchAsync(async (req, res, next) => {
    const comment = await commentService.createComment(
      req.params.postId,
      req.body,
      req.user.id
    );
    successResponse({ res, code: 200, data: comment });
  }),

  getAllComments: catchAsync(async (req, res, next) => {
    const comments = await commentService.getAllComments(req.params.postId);
    successResponse({ res, code: 200, data: comments });
  }),

  updateComment: catchAsync(async (req, res, next) => {
    const comment = await commentService.updateComment(
      req.params.commentId,
      req.body,
      req.user
    );
    successResponse({ res, code: 200, data: comment });
  }),

  deleteComment: catchAsync(async (req, res, next) => {
    await commentService.deleteComment(req.params.postId, req.params.commentId);
    successResponse({ res, code: 200, data: null });
  }),
};

module.exports = commentController;
