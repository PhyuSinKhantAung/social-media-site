const { ObjectId } = require('mongodb');
const Post = require('../models/post.model');
const Share = require('../models/sharePost.model');
const { POST_ERRORS, SHARE_POST_ERRORS } = require('../constant');

const shareService = {
  createShare: async (postId, userId, reqBody) => {
    const post = await Post.findById(postId);

    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    await Share.create({
      ...reqBody,
      post: ObjectId(postId),
      sharedBy: ObjectId(userId),
    });
  },

  updateShare: async (sharePostId, userId, reqBody) => {
    const sharePost = await Share.findById(sharePostId);

    if (!sharePost) throw SHARE_POST_ERRORS.SHARE_POST_NOT_FOUND;

    if (sharePost.sharedBy._id.toString() !== userId)
      throw POST_ERRORS.OWNER_ONLY_ALLOWED;

    const updatedSharedPost = await Share.findByIdAndUpdate(
      sharePostId,
      reqBody,
      { runValidators: true, new: true }
    );

    return updatedSharedPost;
  },

  deleteShare: async (sharePostId, userId) => {
    const sharePost = await Share.findById(sharePostId);

    if (!sharePost) throw SHARE_POST_ERRORS.SHARE_POST_NOT_FOUND;

    if (sharePost.sharedBy._id.toString() !== userId)
      throw POST_ERRORS.OWNER_ONLY_ALLOWED;

    await Share.findByIdAndDelete(sharePostId);
  },

  getSharedPost: async (sharePostId) => {
    const sharedPost = await Share.findById(sharePostId);

    if (!sharedPost) throw SHARE_POST_ERRORS.SHARE_POST_NOT_FOUND;

    return sharedPost;
  },
};

module.exports = shareService;
