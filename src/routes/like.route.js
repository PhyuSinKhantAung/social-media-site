const route = require('express').Router({ mergeParams: true });
const likeController = require('../controllers/like.controller');
const authenticate = require('../middlewares/authenticate');

route.get('/', authenticate, likeController.getAllLikes);

route.post('/create-like', authenticate, likeController.createlike);
route.delete('/unlike', authenticate, likeController.unlike);

module.exports = route;
