const route = require('express').Router({ mergeParams: true });
const likeController = require('../controllers/like.controller');
const authenticate = require('../middlewares/authenticate');

route.post('/like', authenticate, likeController.createlike);
route.delete('/unlike', authenticate, likeController.unlike);
// route.delete('/:likeId', authenticate, likeController.deletelike);

module.exports = route;
