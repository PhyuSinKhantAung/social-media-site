const route = require('express').Router({ mergeParams: true });
const commentController = require('../controllers/comment.controller');
const authenticate = require('../middlewares/authenticate');

route.post('/', authenticate, commentController.createComment);
route.get('/', authenticate, commentController.getComments);
route.patch('/:commentId', authenticate, commentController.updateComment);
route.delete('/:commentId', authenticate, commentController.deleteComment);

module.exports = route;
