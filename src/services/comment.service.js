const { ObjectId } = require('mongodb');

const Post = require('../models/post.model');

const commentService = {
  createComment: async (postId, reqBody, userId) => {
    reqBody.user_id = userId;
    const commentedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: reqBody },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({ path: 'comments.user_id', select: 'name profile_pic' })
      .populate({ path: 'user', select: 'name profile_pic' });
    return commentedPost;
  },
  getAllComments: async (postId) => {
    const post = await Post.findById(postId);
    // console.log(post.comments);
    return post.comments;
  },
  updateComment: async (postId, commentId, reqBody) => {
    const post = await Post.findOneAndUpdate(
      { _id: ObjectId(postId), 'comments._id': ObjectId(commentId) },
      {
        $set: { 'comments.$.text': reqBody.text },
      }
    );

    const updatedComment = post.comments.find(
      (el) => el._id.toString() === commentId
    );
    return updatedComment;
  },
  deleteComment: async (postId, commentId) => {
    await Post.findOneAndUpdate(
      { _id: ObjectId(postId), 'comments._id': ObjectId(commentId) },
      {
        $pull: { comments: { _id: commentId } },
      }
    );
  },
};

module.exports = commentService;
