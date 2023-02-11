const Post = require('../models/post.model');
const User = require('../models/user.model');
const { ApiError } = require('../errors');

const postService = {
  getAllposts: async () => {
    const posts = await Post.find();
    return posts;
  },
  getAllMyPosts: async (reqUser) => {
    const posts = await Post.find({ user: reqUser.id });
    return posts;
  },
  createPost: async (reqBody, reqUser, images) => {
    const imageUrlsArr = images.map((img) => ({
      url: img.path,
    }));

    const user = await User.findById(reqUser);

    const canTag = user.friends.every((friId) =>
      reqBody.tags.map((tagId) => tagId === friId.toString())
    );

    if (!canTag)
      throw new ApiError('You cannot tag who is not friend with you', 400);

    const post = await (
      await Post.create({
        ...reqBody,
        user: reqUser.id,
        images: imageUrlsArr,
      })
    ).populate({
      path: 'user',
      select: 'name profile_pic',
    });
    return post;
  },
  updatePost: async (reqBody, postId, images) => {
    const imageUrlsArr = images.map((img) => ({
      url: img.path,
    }));
    const post = await Post.findByIdAndUpdate(
      postId,
      { ...reqBody, images: imageUrlsArr },
      {
        new: true,
      }
    );
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
