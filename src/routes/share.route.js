const route = require('express').Router();
const authentication = require('../middlewares/authenticate');
const shareController = require('../controllers/share.controller');
const { validateParams, validateBody } = require('../middlewares/validation');
const sharePostSchema = require('../schemas/sharePost.schema');

route.post(
  '/:id',
  authentication,
  validateParams(sharePostSchema.idSchema),
  validateBody(sharePostSchema.sharePost),
  shareController.createShare
);

route.patch(
  '/:id',
  authentication,
  validateParams(sharePostSchema.idSchema),
  validateBody(sharePostSchema.sharePost),
  shareController.updateShare
);

route.get(
  '/:id',
  authentication,
  validateParams(sharePostSchema.idSchema),
  shareController.getSharedPost
);

route.delete(
  '/:id',
  authentication,
  validateParams(sharePostSchema.idSchema),
  shareController.deleteShare
);

module.exports = route;
