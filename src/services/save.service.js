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
  },

  unsaved: async (postId, userId) => {
    const post = await Post.findById(postId);

    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    const savedPost = await Save.findOneAndDelete({
      post: postId,
      savedBy: userId,
    });

    if (!savedPost) throw SAVED_POST_ERRORS.SAVED_POST_NOT_FOUND;
  },

  getAllSavedPosts: async (userId) => {
    const savedPosts = await Save.find({ savedBy: userId }).populate('post');

    if (!savedPosts) throw SAVED_POST_ERRORS.SAVED_POST_NOT_FOUND;

    return savedPosts;
  },

  getSavedPost: async (postId, userId) => {
    const savedPost = await Save.findOne({
      post: postId,
      savedBy: userId,
    })
      .populate('post')
      .populate({ path: 'savedBy', select: 'username profile_pic' });

    if (!savedPost) throw SAVED_POST_ERRORS.SAVED_POST_NOT_FOUND;

    return savedPost;
  },
};

module.exports = saveService;
