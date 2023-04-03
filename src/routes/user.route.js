const route = require('express').Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/authenticate');
const { validateBody, validateParams } = require('../middlewares/validation');
const { uploadProfilePic } = require('../library/multer');
const userSchemas = require('../schemas/user.schema');
const friendController = require('../controllers/friend.controller');
const friendSchema = require('../schemas/friend.schema');

route.get('/', authenticate, userController.getAllUsers);
route.get('/me', authenticate, userController.getMe);

route.get(
  '/:id',
  authenticate,
  validateParams(userSchemas.idSchema),
  userController.getUserById
);

route.patch(
  '/me',
  authenticate,
  validateBody(userSchemas.updateUserSchema),
  uploadProfilePic,
  userController.updateMe
);

route.delete('/me/deactivate', authenticate, userController.deactivateMe);

route.get(
  '/:id/mutualFriends',
  authenticate,
  validateParams(friendSchema.idSchema),
  friendController.getMutualFriends
);

module.exports = route;
