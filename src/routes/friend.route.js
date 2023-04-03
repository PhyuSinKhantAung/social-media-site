const route = require('express').Router();
const friendController = require('../controllers/friend.controller');
const authenticate = require('../middlewares/authenticate');
const { validateParams } = require('../middlewares/validation');
const friendSchema = require('../schemas/friend.schema');

route.post(
  '/addFriend/:id',
  authenticate,
  validateParams(friendSchema.idSchema),
  friendController.addFriend
);

route.get(
  '/friendRequests/:userId',
  authenticate,
  friendController.getAllFriendRequests
);

route.post(
  '/confirmFriend/:id',
  authenticate,
  validateParams(friendSchema.idSchema),
  friendController.confirmFriend
);

route.post(
  '/cancelRequest/:id',
  authenticate,
  validateParams(friendSchema.idSchema),
  friendController.cancelRequest
);

route.post(
  '/unfriend/:id',
  authenticate,
  validateParams(friendSchema.idSchema),
  friendController.unfriend
);

route.post(
  '/block/:id',
  authenticate,
  validateParams(friendSchema.idSchema),
  friendController.blockUser
);

route.delete(
  '/unblock/:id',
  authenticate,
  validateParams(friendSchema.idSchema),
  friendController.unblockUser
);

route.get('/', authenticate, friendController.getAllFriends);

route.get('/blocksList', authenticate, friendController.getAllBlockedUsers);

module.exports = route;
