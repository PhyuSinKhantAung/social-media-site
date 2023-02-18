const catchAsync = require('../utilities/catchAsync');
const friendService = require('../services/friend.service');

exports.addFriend = catchAsync(async (req, res, next) => {
  const addedFriendInfo = await friendService.addFriend(
    req.params.id,
    req.user.id
  );
  res.status(200).json({
    code: 200,
    data: addedFriendInfo,
  });
});

exports.getAllFriendRequests = catchAsync(async (req, res, next) => {
  const friendRequests = await friendService.getAllFriendRequests(req.user.id);
  res.status(200).json({
    code: 200,
    data: friendRequests,
  });
});

exports.confirmFriend = catchAsync(async (req, res, next) => {
  const confirmFriend = await friendService.confirmFriend(
    req.params.id,
    req.user.id
  );
  res.status(200).json({
    code: 200,
    data: confirmFriend,
  });
});

exports.cancelRequest = catchAsync(async (req, res, next) => {
  await friendService.cancelRequest(req.params.id, req.user.id);
  res.status(200).json({
    code: 200,
    data: null,
    message: 'You cancelled this request.',
  });
});

exports.unfriend = catchAsync(async (req, res, next) => {
  const unfriend = await friendService.unfriend(req.params.id, req.user.id);
  res.status(200).json({
    code: 200,
    data: unfriend,
  });
});

exports.blockFriend = catchAsync(async (req, res, next) => {
  await friendService.blockFriend(req.params.id, req.user.id);
  res.status(200).json({
    code: 200,
    data: null,
    message: 'You blocked successfully.',
  });
});

exports.unblockFriend = catchAsync(async (req, res, next) => {
  const unblockFriend = await friendService.unblock(req.params.id, req.user.id);
  res.status(200).json({
    code: 200,
    data: unblockFriend,
  });
});

exports.getAllFriends = catchAsync(async (req, res, next) => {
  const friends = await friendService.getAllFriends(req.user.id);
  res.status(200).json({
    code: 200,
    data: friends,
  });
});

exports.getAllBlocks = catchAsync(async (req, res, next) => {
  const blocks = await friendService.getAllBlocks(req.user.id);
  res.status(200).json({
    code: 200,
    data: blocks,
  });
});

exports.getMutualFriends = catchAsync(async (req, res, next) => {
  const mutualFriends = await friendService.getMutualFriends(
    req.user.id,
    req.params.id
  );
  res.status(200).json({
    code: 200,
    data: mutualFriends,
  });
});
