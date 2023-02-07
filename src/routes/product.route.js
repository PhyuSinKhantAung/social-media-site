const route = require('express').Router();
const productController = require('../controllers/product.controller');

route.get('/', productController.getAllProducts);

module.exports = route;
