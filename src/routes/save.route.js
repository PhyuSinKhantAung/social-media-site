const route = require('express').Router();
const saveController = require('../controllers/save.controller');
const authentication = require('../middlewares/authenticate');
const { validateParams } = require('../middlewares/validation');
const savedPostSchema = require('../schemas/savedPost.schema');

route.get('/', authentication, saveController.getAllSavedPosts);

route.post(
  '/:id',
  authentication,
  validateParams(savedPostSchema.idSchema),
  saveController.createSave
);
route.delete(
  '/:id',
  authentication,
  validateParams(savedPostSchema.idSchema),
  saveController.unsaved
);

route.get(
  '/:id',
  authentication,
  validateParams(savedPostSchema.idSchema),
  saveController.getSavedPost
);

module.exports = route;
