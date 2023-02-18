const route = require('express').Router();
const userController = require('../controllers/user.controller');
const friendRouter = require('./friend.route');
const authenticate = require('../middlewares/authenticate');
const { uploadProfilePic } = require('../library/multer');

route.get('/', authenticate, userController.getAllUsers);
route.get('/me', authenticate, userController.getMe);
route.patch('/me', authenticate, uploadProfilePic, userController.updateMe);
route.delete('/me/deactivate', authenticate, userController.deactivateMe);
route.delete('/me/delete', authenticate, userController.deleteMe);
route.get('/:id', authenticate, userController.getUser);

// users/:userId/mutualFriends / GET Method
route.use('/:id/mutualFriends', friendRouter);

module.exports = route;
