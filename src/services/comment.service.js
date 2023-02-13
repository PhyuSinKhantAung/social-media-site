const { ObjectId } = require('mongodb');
const { BadRequestError } = require('../errors');

const Post = require('../models/post.model');
const APIFeatures = require('../utilities/apiFeatures');

const commentService = {
  createComment: async (postId, reqBody, userId) => {
    reqBody.commented_by = userId;
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
      .populate({ path: 'comments.commented_by', select: 'name profile_pic' })
      .populate({ path: 'user', select: 'name profile_pic' });
    if (!commentedPost)
      throw new BadRequestError('The post with that id does not exist.', 400);
    return commentedPost;
  },
  getAllComments: async (postId, reqQuery) => {
    const features = await new APIFeatures(Post.findById(postId), reqQuery)
      .limitFields()
      .paginate()
      .sort();
    const post = await features.query;
    if (!post)
      throw new BadRequestError('The post with that id does not exist.', 400);
    return post.comments;
  },
  updateComment: async (postId, commentId, reqBody) => {
    const post = await Post.findOneAndUpdate(
      { _id: ObjectId(postId), 'comments._id': ObjectId(commentId) },
      {
        $set: { 'comments.$.text': reqBody.text },
      },
      { new: true, runValidators: true }
    );

    if (!post)
      throw new BadRequestError('The post with that id does not exist.', 400);

    const updatedComment = post.comments.find(
      (el) => el._id.toString() === commentId
    );

    return updatedComment;
  },
  deleteComment: async (postId, commentId) => {
    const post = await Post.findOneAndUpdate(
      { _id: ObjectId(postId), 'comments._id': ObjectId(commentId) },
      {
        $pull: { comments: { _id: commentId } },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post)
      throw new BadRequestError('The post with that id does not exist.', 400);
    return post;
  },
};

module.exports = commentService;
