const Post = require('../models/post.model');
const User = require('../models/user.model');
const Share = require('../models/share.model');
const { ApiError, BadRequestError } = require('../errors');
const APIFeatures = require('../utilities/apiFeatures');
const cloudinary = require('../library/cloudinaryConfig');

const postService = {
  getAllposts: async (userId, reqQuery) => {
    // const features = new APIFeatures(Post.find(), reqQuery)
    //   .filter()
    //   .paginate()
    //   .sort();

    // const allPosts = await features.query;

    const user = await User.findById(userId).select('+last_access');
    if (!user) throw new BadRequestError('There is no user with that id', 400);

    const allPosts = await Post.find({ createdAt: { $gt: user.last_access } });
    const allShares = await Share.find({
      createdAt: { $gt: user.last_access },
    });

    user.last_access = new Date();
    await user.save();

    const unseenAllPostsAndShares = [...allShares, ...allPosts];

    return unseenAllPostsAndShares;
  },
  getAllMyPosts: async (reqUser, reqQuery) => {
    const allShares = await Share.find({ sharedBy: reqUser.id });
    const allPosts = await Post.find({ user: reqUser.id }).sort('-createdAt');

    const allPostsAndShares = [...allShares, ...allPosts];

    if (!allPostsAndShares)
      throw new BadRequestError(
        `You cannot get your posts with invalid user id`,
        400
      );
    return allPostsAndShares;
  },
  createPost: async (reqBody, reqUser, images = []) => {
    const imageUrlsArr = images.map((img) => ({
      url: img.path,
    }));

    // check tag user-id include or not in friend-list

    if (typeof reqBody.taggedUserIds === 'string') {
      const taggedUserIdsArray = reqBody.taggedUserIds.split(',');
      reqBody.taggedUserIds = taggedUserIdsArray;
    }

    if (reqBody.taggedUserIds) {
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

  updatePost: async (reqBody, reqUser, postId, images = []) => {
    const imageUrlsArr = images.map((img) => ({
      url: img.path,
    }));
    console.log(images);

    // check tag user-id include or not in friend-list
    if (reqBody.taggedUserIds) {
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

    const post = await Post.findByIdAndUpdate(
      postId,
      { ...reqBody, $push: { images: { $each: imageUrlsArr } } },
      { new: true }
    );
    if (!post)
      throw new BadRequestError('The post with that id does not exist.', 400);
    return post;
  },

  deleteImages: async (reqBody, postId) => {
    const post = await Post.findById(postId);
    if (!post)
      throw new BadRequestError('The post with that id does not exists.', 400);

    const { deletedImages } = reqBody;
    if (!deletedImages)
      throw new ApiError(`This route is only for deleting post's images`, 400);
    const hadToDelId = post.images.filter((imgUrlObj) =>
      deletedImages.some((id) => id === imgUrlObj._id.toString())
    );

    if (hadToDelId.length !== deletedImages.length)
      throw new BadRequestError(
        `The Id you want to delete does not match with chosen image's id`,
        400
      );

    const deletedImgPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pullAll: { images: hadToDelId },
      },
      { new: true, runValidators: true }
    );
    // Delete from cloudinary
    cloudinary.uploader.destroy(reqBody.public_id, (error, result) => {
      if (error) {
        throw new ApiError('Image deleting fails');
      } else {
        console.log('OK');
      }
    });

    return deletedImgPost;
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
