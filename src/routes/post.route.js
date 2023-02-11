const route = require('express').Router();
const postController = require('../controllers/post.controller');
const authenticate = require('../middlewares/authenticate');
const { uploadImages } = require('../library/multer');
const validation = require('../middlewares/validation');
const postSchema = require('../schemas/post.schema');
const commentRoute = require('./comment.route');
const likeRoute = require('./like.route');

route.get('/', postController.getAllposts);
route.get('/me', authenticate, postController.getAllMyPosts);
route.post(
  '/',
  authenticate,
  validation(postSchema.createPostSchema),
  uploadImages,
  postController.createPost
);
route.get('/:id', authenticate, postController.getPost);
route.patch('/:id', authenticate, uploadImages, postController.updatePost);
// route.put('/:id', authenticate, uploadImages, postController.deleteImages);

route.delete('/:id', authenticate, postController.deletePost);

// comments
route.use('/:id/comments', commentRoute);

// likes
route.use('/:id/likes', likeRoute);

module.exports = route;
