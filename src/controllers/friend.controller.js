const catchAsync = require('../utilities/catchAsync');
const friendService = require('../services/friend.service');
const successResponse = require('../utilities/successResponse');

const friendController = {
  addFriend: catchAsync(async (req, res, next) => {
    await friendService.addFriend(req.params.id, req.user.id);
    successResponse({ res, code: 200, message: 'You send a request!' });
  }),

  getAllFriendRequests: catchAsync(async (req, res, next) => {
    const friendRequests = await friendService.getAllFriendRequests(
      req.params.userId
    );
    successResponse({ res, code: 200, data: friendRequests });
  }),

  confirmFriend: catchAsync(async (req, res, next) => {
    console.log('hello');
    await friendService.confirmFriend(req.params.id, req.user.id);
    successResponse({ res, code: 200, message: 'You comfirm it!' });
  }),

  cancelRequest: catchAsync(async (req, res, next) => {
    await friendService.cancelRequest(req.params.id, req.user.id);
    successResponse({ res, code: 200, message: 'You cancel it!' });
  }),

  unfriend: catchAsync(async (req, res, next) => {
    await friendService.unfriend(req.params.id, req.user.id);
    successResponse({ res, code: 200, message: 'You unfriend it!' });
  }),

  blockUser: catchAsync(async (req, res, next) => {
    await friendService.blockUser(req.params.id, req.user.id);
    successResponse({ res, code: 200, message: 'You blocked it!' });
  }),

  unblockUser: catchAsync(async (req, res, next) => {
    await friendService.unblockUser(req.params.id, req.user.id);
    successResponse({ res, code: 204 });
  }),

  getAllFriends: catchAsync(async (req, res, next) => {
    const friends = await friendService.getAllFriends(req.user.id);
    successResponse({ res, code: 200, data: friends });
  }),

  getAllBlockedUsers: catchAsync(async (req, res, next) => {
    const blockedUsers = await friendService.getAllBlockedUsers(req.user.id);
    successResponse({ res, code: 200, data: blockedUsers });
  }),

  getMutualFriends: catchAsync(async (req, res, next) => {
    const mutualFriends = await friendService.getMutualFriends(
      req.params.id,
      req.user.id
    );
    successResponse({ res, code: 200, data: mutualFriends });
  }),
};

module.exports = friendController;
