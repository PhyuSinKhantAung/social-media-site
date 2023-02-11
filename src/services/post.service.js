const Post = require('../models/post.model');
const User = require('../models/user.model');
const { ApiError } = require('../errors');
const Friend = require('../models/friend.model');

const postService = {
  getAllposts: async () => {
    const posts = await Post.find();
    return posts;
  },
  getAllMyPosts: async (reqUser) => {
    const posts = await Post.find({ user: reqUser.id });
    return posts;
  },
  createPost: async (reqBody, reqUser, images = []) => {
    const imageUrlsArr = images.map((img) => ({
      url: img.path,
    }));

    // if user tagged
    if (reqBody.taggedUserIds) {
      // check tag user-id include or not in friend-list
      const tags = reqBody.taggedUserIds;
      const user = await User.findById(reqUser);
      const { friends } = user;

      const canTag = tags.filter((tagId) =>
        friends.some((friId) => friId.toString() === tagId)
      );

      if (canTag.length !== tags.length)
        throw new ApiError(
          'Tag user id does not exist in your friend list',
          400
        );
    }

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
  updatePost: async (reqBody, postId, images = []) => {
    // gonna update images without deleting previous images
    const imageUrlsArr = images.map((img) => ({
      url: img.path,
    }));

    imageUrlsArr.forEach(async (imgUrlObj) => {
      const post = await Post.findByIdAndUpdate(
        postId,
        { ...reqBody, $push: { images: imgUrlObj } },
        {
          new: true,
        }
      );
      return post;
    });

    return await Post.findById(postId);
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
