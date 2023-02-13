const route = require('express').Router({ mergeParams: true });
const saveController = require('../controllers/save.controller');
const authentication = require('../middlewares/authenticate');

route.post('/', authentication, saveController.createSave); //merged with post route

route.get('/', authentication, saveController.getAllSavedPosts);

route.get('/:id', authentication, saveController.getSavedPost);

route.delete('/:id', authentication, saveController.unsaved);

module.exports = route;
