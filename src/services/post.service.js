const Post = require('../models/post.model');
const User = require('../models/user.model');
const Share = require('../models/sharePost.model');
const cloudinary = require('../library/cloudinaryConfig');
const { POST_ERRORS } = require('../constant');

const postService = {
  getAllposts: async (reqUser, reqQuery) => {
    const user = await User.findById(reqUser.id).select('+last_access');

    // const allPosts = await Post.find({
    //   createdAt: { $gt: user.last_access },
    // }).populate({ path: 'post_creator', select: 'username profile_pic' });

    // const allShares = await Share.find({
    //   createdAt: { $gt: user.last_access },
    // })
    //   .populate({ path: 'sharedBy', select: 'username profile_pic' })
    //   .populate('post');
    const allPosts = await Post.find()
      .sort('-createdAt')

      .populate({
        path: 'post_creator',
        select: 'username profile_pic',
      })
      .populate('comments');

    const allShares = await Share.find()
      .sort('-createdAt')

      .populate({
        path: 'post',
        populate: {
          path: 'post_creator',
          model: 'User',
          select: 'username profile_pic',
        },
      })
      .populate({
        path: 'sharedBy',
        select: 'username profile_pic',
      });

    user.last_access = new Date();
    await user.save();

    const unseenAllPostsAndShares = [...allShares, ...allPosts];

    unseenAllPostsAndShares.sort();

    return unseenAllPostsAndShares;
  },

  getAllMyPosts: async (reqUser) => {
    const allSharedPosts = await Share.find({ sharedBy: reqUser.id })
      .sort('-createdAt')
      .populate({
        path: 'post',
        populate: {
          path: 'post_creator',
          model: 'User',
          select: 'username profile_pic',
        },
      })
      .populate({
        path: 'sharedBy',
        select: 'username profile_pic',
      });
    const allPosts = await Post.find({ post_creator: reqUser.id })
      .sort('-createdAt')
      .populate({
        path: 'post_creator',
        select: 'username profile_pic',
      })
      .populate('comments');

    const allPostsAndSharedPosts = [...allSharedPosts, ...allPosts];

    if (!allPostsAndSharedPosts) throw POST_ERRORS.POST_NOT_FOUND;

    return allPostsAndSharedPosts;
  },
  getUserAllPosts: async (userId) => {
    const allSharedPosts = await Share.find({ sharedBy: userId })
      .sort('-createdAt')
      .populate({
        path: 'post',
        populate: {
          path: 'post_creator',
          model: 'User',
          select: 'username profile_pic',
        },
      })
      .populate({
        path: 'sharedBy',
        select: 'username profile_pic',
      });

    const allPosts = await Post.find({ post_creator: userId })
      .sort('-createdAt')
      .populate({
        path: 'post_creator',
        select: 'username profile_pic',
      })
      .populate('comments');

    const allPostsAndSharedPosts = [...allSharedPosts, ...allPosts];

    if (!allPostsAndSharedPosts) throw POST_ERRORS.POST_NOT_FOUND;

    return allPostsAndSharedPosts;
  },

  getPost: async (postId) => {
    const post = await Post.findById(postId);
    console.log('post---->', post);
    if (!post) throw POST_ERRORS.POST_NOT_FOUND;
    return post;
  },

  createPost: async (reqBody, reqUser, images = []) => {
    const imageUrlsArr = images.map((img) => ({
      url: img.path,
      public_id: img.filename,
    }));

    // if user request was a string
    if (typeof reqBody.taggedUserIds === 'string') {
      const taggedUserIdsArray = reqBody.taggedUserIds.split(',');
      reqBody.taggedUserIds = taggedUserIdsArray;
    }

    // check tag user-id include or not in friend-list
    if (reqBody.taggedUserIds) {
      const tags = reqBody.taggedUserIds;
      const user = await User.findById(reqUser);
      const { friends } = user;

      const canTag = tags.filter((tagId) =>
        friends.some((friId) => friId.toString() === tagId)
      );

      if (canTag.length !== tags.length)
        throw POST_ERRORS.TAGGED_USER_NOT_FOUND;
    }

    const post = await (
      await Post.create({
        ...reqBody,
        post_creator: reqUser.id,
        images: imageUrlsArr,
      })
    ).populate({
      path: 'post_creator',
      select: 'username profile_pic',
    });

    return post;
  },

  updatePost: async (reqBody, reqUser, postId, images = []) => {
    const imageUrlsArr = images.map((img) => ({
      url: img.path,
      public_id: img.filename,
    }));

    // if user request was a string
    if (typeof reqBody.taggedUserIds === 'string') {
      const taggedUserIdsArray = reqBody.taggedUserIds.split(',');
      reqBody.taggedUserIds = taggedUserIdsArray;
    }

    // check tag user-id include or not in friend-list
    if (reqBody.taggedUserIds) {
      const tags = reqBody.taggedUserIds;
      const user = await User.findById(reqUser);
      const { friends } = user;

      const canTag = tags.filter((tagId) =>
        friends.some((friId) => friId.toString() === tagId)
      );

      if (canTag.length !== tags.length)
        throw POST_ERRORS.TAGGED_USER_NOT_FOUND;
    }

    const post = await Post.findById(postId);
    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    if (post.post_creator._id.toString() !== reqUser.id) {
      throw POST_ERRORS.OWNER_ONLY_ALLOWED;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...reqBody, $push: { images: { $each: imageUrlsArr } } },
      { new: true }
    );

    return updatedPost;
  },

  deleteImages: async (reqBody, reqUser, postId) => {
    const post = await Post.findById(postId);
    if (!post) throw POST_ERRORS.POST_NOT_FOUND;

    if (post.post_creator._id.toString() !== reqUser.id) {
      throw POST_ERRORS.OWNER_ONLY_ALLOWED;
    }

    const { deletedImages } = reqBody;

    const hadToDeleteImageIdArr = post.images.filter((imgUrlObj) =>
      deletedImages.some((id) => id === imgUrlObj._id.toString())
    );

    if (hadToDeleteImageIdArr.length !== deletedImages.length)
      throw POST_ERRORS.IMAGE_NOT_FOUND;

    const deletedImgPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pullAll: { images: hadToDeleteImageIdArr },
      },
      { new: true, runValidators: true }
    );

    // Delete from cloudinary
    hadToDeleteImageIdArr.forEach((urlObj) => {
      cloudinary.uploader.destroy(urlObj.public_id, (error, result) => {
        if (error) {
          throw POST_ERRORS.DELETE_IMAGE_FAILS;
        }
      });
    });

    return deletedImgPost;
  },

  deletePost: async (postId, reqUser) => {
    const post = await Post.findByIdAndDelete(postId);
    if (!post) throw POST_ERRORS.POST_NOT_FOUND;
    if (post.post_creator._id.toString() !== reqUser.id) {
      throw POST_ERRORS.OWNER_ONLY_ALLOWED;
    }
  },
};

module.exports = postService;
