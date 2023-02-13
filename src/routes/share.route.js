const route = require('express').Router();
const authentication = require('../middlewares/authenticate');
const shareController = require('../controllers/share.controller');

route.post('/:id', authentication, shareController.createShare);

route.patch('/:id', authentication, shareController.updateShare);

route.delete('/:id', authentication, shareController.deleteShare);

module.exports = route;
