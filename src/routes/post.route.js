const route = require('express').Router();
const postController = require('../controllers/post.controller');
const authenticate = require('../middlewares/authenticate');
const { uploadImages } = require('../library/multer');
const { validateBody, validateParams } = require('../middlewares/validation');
const postSchema = require('../schemas/post.schema');
const commentRoute = require('./comment.route');
const likeRoute = require('./like.route');
const shareRoute = require('./share.route');
const saveRoute = require('./save.route');

route.get('/newsfeed', authenticate, postController.getAllposts);

route.get('/me', authenticate, postController.getAllMyPosts);

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

// // likes
// route.use('/:id/likes', likeRoute);

// // shares
// route.use('/:id/share', shareRoute);

// // saves
// route.use('/:id/save', saveRoute);

module.exports = route;
