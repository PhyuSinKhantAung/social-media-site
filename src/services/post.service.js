const Post = require('../models/post.model');

const postService = {
  getAllposts: async () => {
    const posts = await Post.find();
    return posts;
  },
  getAllMyPosts: async (reqUser) => {
    const posts = await Post.find({ user: reqUser.id });
    return posts;
  },
  createPost: async (reqBody, reqUser) => {
    reqBody.user = reqUser.id;
    const post = await (
      await Post.create(reqBody)
    ).populate({
      path: 'user',
      select: 'name profile_pic',
    });
    return post;
  },
  updatePost: async (reqBody, postId) => {
    const post = await Post.findByIdAndUpdate(postId, reqBody, {
      new: true,
      runValidators: true,
    });
    return post;
  },
  deletePost: async (postId) => {
    await Post.findByIdAndDelete(postId);
  },
  getPost: async (postId) => {
    const post = await Post.findById(postId);
    return post;
  },
};

module.exports = postService;
