const route = require('express').Router();
const postController = require('../controllers/post.controller');
const authenticate = require('../middlewares/authenticate');
const commentRoute = require('./comment.route');
const likeRoute = require('./like.route');

route.get('/', postController.getAllposts);
route.get('/me', authenticate, postController.getAllMyPosts);
route.post('/', authenticate, postController.createPost);
route.get('/:id', authenticate, postController.getPost);
route.put('/:id', authenticate, postController.updatePost);
route.delete('/:id', authenticate, postController.deletePost);

// comments
route.use('/:id/comments', commentRoute);

// likes
route.use('/:id/likes', likeRoute);

module.exports = route;
