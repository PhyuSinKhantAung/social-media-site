const route = require('express').Router({ mergeParams: true });
const friendController = require('../controllers/friend.controller');
const authenticate = require('../middlewares/authenticate');

route.post('/addFriend/:id', authenticate, friendController.addFriend);
route.get(
  '/friendRequests',
  authenticate,
  friendController.getAllFriendRequests
);

route.post('/confirmFriend/:id', authenticate, friendController.confirmFriend);
route.post('/unfriend/:id', authenticate, friendController.unfriend);
route.post('/block/:id', authenticate, friendController.blockFriend);
route.post('/unblock/:id', authenticate, friendController.unblockFriend);

route.get('/friendsList', authenticate, friendController.getAllFriends);
route.get('/blocksList', authenticate, friendController.getAllBlocks);

module.exports = route;
