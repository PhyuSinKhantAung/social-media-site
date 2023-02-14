const route = require('express').Router();
const userController = require('../controllers/user.controller');
const friendRouter = require('./friend.route');
const authenticate = require('../middlewares/authenticate');
const { uploadProfilePic } = require('../library/multer');

route.get('/', userController.getAllUsers);
route.get('/:id', authenticate, userController.getUser);

route.patch('/me', authenticate, uploadProfilePic, userController.updateMe);

route.use('/:id/mutualFriends', friendRouter);

module.exports = route;
