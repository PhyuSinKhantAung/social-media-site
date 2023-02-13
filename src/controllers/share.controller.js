const catchAsync = require('../utilities/catchAsync');
const shareService = require('../services/share.service');

exports.createShare = catchAsync(async (req, res, next) => {
  const sharedPost = await shareService.createShare(
    req.params.id,
    req.user.id,
    req.body
  );
  res.status(200).json({
    code: 200,
    data: sharedPost,
  });
});

exports.updateShare = catchAsync(async (req, res, next) => {
  const updatedSharePost = await shareService.updateShare(
    req.params.id,
    req.body
  );
  res.status(200).json({
    code: 200,
    data: updatedSharePost,
  });
});

exports.deleteShare = catchAsync(async (req, res, next) => {
  await shareService.deleteShare(req.params.id);
  res.status(200).json({
    code: 200,
    data: null,
  });
});

exports.getSharedPost = catchAsync(async (req, res, next) => {
  const sharedPost = await shareService.getSharedPost(
    req.params.id,
    req.user.id
  );
  res.status(200).json({
    code: 200,
    data: sharedPost,
  });
});
