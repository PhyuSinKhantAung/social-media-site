const { ObjectId } = require('mongodb');
const { BadRequestError } = require('../errors');
const Post = require('../models/post.model');
const User = require('../models/share.model');
const Share = require('../models/share.model');

const shareService = {
  createShare: async (postId, userId, reqBody) => {
    const post = await Post.findById(postId);
    if (!post) throw new BadRequestError('There is no post with that id.', 400);
    const sharedPost = await Share.create({
      ...reqBody,
      post: ObjectId(postId),
      sharedBy: ObjectId(userId),
    });
    return sharedPost;
  },
  updateShare: async (sharePostId, reqBody) => {
    if (!(await Share.findById(sharePostId)))
      throw new BadRequestError('There is no post with that id', 400);
    const updatedSharedPost = await Share.findByIdAndUpdate(
      sharePostId,
      reqBody,
      { runValidators: true, new: true }
    );

    return updatedSharedPost;
  },
  deleteShare: async (sharePostId) => {
    if (!(await Share.findById(sharePostId)))
      throw new BadRequestError('There is no post with that id', 400);
    await Share.findByIdAndDelete(sharePostId);
  },
};

module.exports = shareService;
