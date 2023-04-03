const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const { POST_ERRORS, COMMENT_ERRORS } = require('../constant');

const commentService = {
  createComment: async (postId, reqBody, userId) => {
    reqBody.commented_by = userId;
    reqBody.commented_postId = postId;
    const comment = await (
      await Comment.create(reqBody)
    ).populate({ path: 'commented_by', select: 'username profile_pic' });

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment._id },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    return comment;
  },

  getAllComments: async (postId) => {
    const post = await Post.findById(postId);
    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    const comments = await Comment.find({ commented_postId: postId }).populate({
      path: 'commented_by',
      select: 'username profile_pic',
    });
    return comments;
  },

  updateComment: async (commentId, reqBody, reqUser) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw COMMENT_ERRORS.COMMENT_NOT_FOUND;

    if (comment.commented_by.toString() !== reqUser.id)
      throw COMMENT_ERRORS.OWNER_ONLY_ALLOWED;

    const updatedComment = await Comment.findByIdAndUpdate(commentId, reqBody, {
      new: true,
      runValidators: true,
    }).populate({
      path: 'commented_by',
      select: 'username profile_pic',
    });

    return updatedComment;
  },

  deleteComment: async (postId, commentId) => {
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) throw COMMENT_ERRORS.COMMENT_NOT_FOUND;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: commentId },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post) throw POST_ERRORS.POST_NOT_FOUND;
  },
};

module.exports = commentService;
