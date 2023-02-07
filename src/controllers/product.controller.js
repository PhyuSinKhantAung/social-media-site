const productService = require('../services/product.service');

exports.getAllProducts = async (req, res, next) => {
  const products = await productService.getAllProducts();
  res.status(200).json({
    code: 200,
    data: products,
    count: products.length,
  });
};
