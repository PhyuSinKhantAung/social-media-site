const route = require('express').Router();
const postController = require('../controllers/post.controller');
const authenticate = require('../middlewares/authenticate');
const { uploadImages } = require('../library/multer');
const validation = require('../middlewares/validation');
const postSchema = require('../schemas/post.schema');
const commentRoute = require('./comment.route');
const likeRoute = require('./like.route');
const shareRoute = require('./share.route');
const saveRoute = require('./save.route');

route.get('/', authenticate, postController.getAllposts);
route.get('/me', authenticate, postController.getAllMyPosts);

route.get('/:id', authenticate, postController.getPost);
route.delete('/:id', authenticate, postController.deletePost);

route.post(
  '/',
  authenticate,
  validation(postSchema.createPostSchema),
  uploadImages,
  postController.createPost
);

route.patch(
  '/:id',
  authenticate,
  validation(postSchema.createPostSchema),
  uploadImages,
  postController.updatePost
);

route.put(
  '/:id',
  authenticate,
  validation(postSchema.deletedImageSchema),
  uploadImages,
  postController.deleteImages
);

// comments
route.use('/:id/comments', commentRoute);

// likes
route.use('/:id/likes', likeRoute);

// shares
route.use('/:id/share', shareRoute);

// saves
route.use('/:id/save', saveRoute);

module.exports = route;
