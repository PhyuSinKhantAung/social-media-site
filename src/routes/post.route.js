const route = require('express').Router();
const postController = require('../controllers/post.controller');
const authenticate = require('../middlewares/authenticate');
const { uploadImages } = require('../library/multer');
const { validateBody, validateParams } = require('../middlewares/validation');
const postSchema = require('../schemas/post.schema');

route.get('/newsfeed', authenticate, postController.getAllposts);

route.get('/me', authenticate, postController.getAllMyPosts);

route.get(
  '/users/:userId',
  authenticate,
  validateParams(postSchema.idSchema),
  postController.getUserAllPosts
);

route.get(
  '/:id',
  authenticate,
  validateParams(postSchema.idSchema),
  postController.getPost
);
route.delete(
  '/:id',
  authenticate,
  validateParams(postSchema.idSchema),
  postController.deletePost
);

route.post(
  '/',
  authenticate,
  validateBody(postSchema.postSchema),
  uploadImages,
  postController.createPost
);

route.patch(
  '/:id',
  authenticate,
  validateParams(postSchema.idSchema),
  validateBody(postSchema.postSchema),
  uploadImages,
  postController.updatePost
);

route.delete(
  '/images/:id',
  authenticate,
  validateParams(postSchema.idSchema),
  validateBody(postSchema.deletedImageSchema),
  uploadImages,
  postController.deleteImages
);

module.exports = route;
