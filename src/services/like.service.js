const { ObjectId } = require('mongodb');
const { POST_ERRORS, LIKE_ERRORS } = require('../constant');

const Post = require('../models/post.model');

const likeService = {
  getAllLikes: async (postId) => {
    const post = await Post.findById(postId).populate({
      path: 'likes',
      select: 'username profile_pic',
    });

    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    return post.likes;
  },

  createlike: async (postId, userId) => {
    const post = await Post.findById(postId);

    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    const isLiked = post.likes.find((id) => id.toString() === userId);

    if (isLiked) throw LIKE_ERRORS.ALREADY_LIKED;

    await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: ObjectId(userId) },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  unlike: async (postId, userId) => {
    const post = await Post.findById(postId);

    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    const likedId = post.likes.find((id) => id.toString() === userId);

    if (!likedId) throw LIKE_ERRORS.LIKE_NOT_FOUND;

    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: likedId.toString() },
    });
  },
};

module.exports = likeService;
