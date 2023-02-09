const catchAsync = require('../utilities/catchAsync');
const likeService = require('../services/like.service');

exports.createlike = catchAsync(async (req, res, next) => {
  const likeedPost = await likeService.createlike(req.params.id, req.user.id);
  res.status(200).json({
    code: 200,
    data: likeedPost,
  });
});

exports.unlike = catchAsync(async (req, res, next) => {
  await likeService.unlike(req.params.id, req.user.id);
  res.status(200).json({
    code: 200,
    data: `We successfully unliked`,
  });
});
