const { ObjectId } = require('mongodb');
const { NotFoundError, BadRequestError, ApiError } = require('../errors');

const Post = require('../models/post.model');

const likeService = {
  createlike: async (postId, userId) => {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: ObjectId(userId) },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    // console.log(post.likes);
    // console.log(userId);
    // const isLiked = post.likes.find((id) => id.toString() === userId);
    // console.log(typeof isLiked);
    // console.log(isLiked);
    // if (isLiked) {
    //   const unlikedPost = await Post.findByIdAndUpdate(postId, {
    //     $pull: { likes: { $in: [isLiked] } },
    //   });
    //   console.log('====>', unlikedPost);
    //   return unlikedPost;
    // }

    return post;
  },
  unlike: async (postId, userId) => {
    const post = await Post.findById(postId);
    const isLiked = post.likes.find((id) => id.toString() === userId);
    if (isLiked) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: isLiked.toString() },
      });
    } else {
      throw new ApiError(
        `You cannot unlike this post without creating like on it.Use another route for creating like.`,
        400
      );
    }
  },
};

module.exports = likeService;
