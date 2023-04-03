const { ObjectId } = require('mongodb');
const { POST_ERRORS, SAVED_POST_ERRORS } = require('../constant');
const Post = require('../models/post.model');
const Save = require('../models/savedPost.model');

const saveService = {
  createSave: async (postId, userId) => {
    const post = await Post.findById(postId);

    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    const isSaved = await Save.findOne({ post: postId, savedBy: userId });
    if (isSaved) throw SAVED_POST_ERRORS.ALREADY_SAVED;

    await Save.create({
      post: postId,
      savedBy: userId,
    });

    await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { saves: ObjectId(userId) },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },

  unsaved: async (postId, userId) => {
    const post = await Post.findById(postId);

    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    const savedPost = await Save.findOneAndDelete({
      post: postId,
      savedBy: userId,
    });

    await Post.findByIdAndUpdate(postId, {
      $pull: { saves: ObjectId(userId) },
    });

    if (!savedPost) throw SAVED_POST_ERRORS.SAVED_POST_NOT_FOUND;
  },

  getAllSavedPosts: async (userId) => {
    const savedPosts = await Save.find({ savedBy: userId }).populate({
      path: 'post',
      populate: {
        path: 'post_creator',
        model: 'User',
        select: 'username profile_pic',
      },
    });

    if (!savedPosts) throw SAVED_POST_ERRORS.SAVED_POST_NOT_FOUND;

    return savedPosts;
  },

  getSavedPost: async (postId, userId) => {
    const savedPost = await Save.findOne({
      post: postId,
      savedBy: userId,
    }).populate({
      path: 'post',
      populate: {
        path: 'post_creator',
        model: 'User',
        select: 'username profile_pic',
      },
    });

    if (!savedPost) throw SAVED_POST_ERRORS.SAVED_POST_NOT_FOUND;

    return savedPost;
  },
};

module.exports = saveService;
