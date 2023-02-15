const catchAsync = require('../utilities/catchAsync');
const commentService = require('../services/comment.service');

exports.createComment = catchAsync(async (req, res, next) => {
  const commentedPost = await commentService.createComment(
    req.params.id,
    req.body,
    req.user.id
  );
  res.status(200).json({
    code: 200,
    data: commentedPost,
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await commentService.getAllComments(
    req.params.id,
    req.query
  );
  res.status(200).json({
    code: 200,
    data: comments,
    count: comments.length,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const updateComment = await commentService.updateComment(
    req.params.id,
    req.params.commentId,
    req.body
  );
  res.status(200).json({
    code: 200,
    data: updateComment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const deletedCommentPost = await commentService.deleteComment(
    req.params.id,
    req.params.commentId
  );
  res.status(200).json({
    code: 200,
    data: deletedCommentPost,
  });
});
