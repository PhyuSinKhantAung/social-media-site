// const catchAsync = require('../utilities/catchAsync');
// const likeService = require('../services/like.service');

// exports.getAllLikes = catchAsync(async (req, res, next) => {
//   const likes = await likeService.getAllLikes(req.params.id);
//   res.status(200).json({
//     code: 200,
//     data: likes,
//   });
// });

// exports.createlike = catchAsync(async (req, res, next) => {
//   const likeedPost = await likeService.createlike(req.params.id, req.user.id);
//   res.status(200).json({
//     code: 200,
//     data: likeedPost,
//   });
// });

// exports.unlike = catchAsync(async (req, res, next) => {
//   const unlikedPost = await likeService.unlike(req.params.id, req.user.id);
//   res.status(200).json({
//     code: 200,
//     data: unlikedPost,
//   });
// });
