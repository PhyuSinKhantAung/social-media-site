const route = require('express').Router();
const likeController = require('../controllers/like.controller');
const authenticate = require('../middlewares/authenticate');
const { validateParams } = require('../middlewares/validation');
const likeSchema = require('../schemas/like.schema');

route.get(
  '/:id',
  validateParams(likeSchema.idSchema),
  authenticate,
  likeController.getAllLikes
);

route.post(
  '/:id',
  authenticate,
  validateParams(likeSchema.idSchema),
  likeController.createlike
);

route.delete('/:id', authenticate, likeController.unlike);

module.exports = route;
