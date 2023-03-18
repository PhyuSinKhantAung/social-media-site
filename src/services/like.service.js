// const { ObjectId } = require('mongodb');
// const { BadRequestError, ApiError } = require('../errors');

// const Post = require('../models/post.model');

// const likeService = {
//   createlike: async (postId, userId) => {
//     const post = await Post.findByIdAndUpdate(
//       postId,
//       {
//         $addToSet: { likes: ObjectId(userId) },
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     if (!post)
//       throw new BadRequestError('The post with that id does not exist.', 400);
//     return post;
//   },
//   unlike: async (postId, userId) => {
//     const post = await Post.findById(postId);
//     const isLiked = post.likes.find((id) => id.toString() === userId);
//     if (isLiked) {
//       await Post.findByIdAndUpdate(postId, {
//         $pull: { likes: isLiked.toString() },
//       });
//     } else {
//       throw new ApiError(
//         `You cannot unlike this post without creating like on it.Use another route for creating like.`,
//         400
//       );
//     }
//     return await Post.findById(postId);
//   },
//   getAllLikes: async (postId) => {
//     const post = await Post.findById(postId).populate({
//       path: 'likes',
//       select: 'username profile_pic',
//     });
//     if (!post)
//       throw new BadRequestError('The post with that id does not exist.', 400);
//     return post.likes;
//   },
// };

// module.exports = likeService;
