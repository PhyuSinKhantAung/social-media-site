const { ApiError } = require('../errors');
const Post = require('../models/post.model');
const User = require('../models/user.model');

const saveService = {
  createSave: async (userId, postId) => {
    const savedPost = await Post.findById(postId);

    if (!savedPost) throw new ApiError('There is no post with that id', 400);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { saves: postId },
      },
      { runValidators: true, new: true }
    ).populate('saves');
    if (!user) throw new ApiError('There is no user with that id', 400);
    return savedPost;
  },
  unsaved: async (userId, postId) => {
    if (!(await Post.findById(postId)))
      throw new ApiError('There is no post with that id', 400);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { saves: postId },
      },
      { runValidators: true, new: true }
    ).populate('saves');

    if (!user) throw new ApiError('There is no user with that id', 400);

    return user.saves;
  },
  getAllSavedPosts: async (userId) => {
    const user = await User.findById(userId).populate('saves');
    if (!user) throw new ApiError('There is no user with that id', 400);
    return user.saves;
  },
  getSavedPost: async (userId, postId) => {
    const user = await User.findById(userId).populate('saves');
    const savedPost = user.saves.find(
      (savePost) => savePost.id.toString() === postId
    );
    if (!savedPost)
      throw new ApiError('There is no saved post with that id', 400);
    return savedPost;
  },
};

module.exports = saveService;
