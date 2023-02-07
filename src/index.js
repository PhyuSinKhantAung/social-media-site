const router = require('express').Router();
const productRouter = require('./routes/product.route');
const authRouter = require('./routes/auth.route');

router.use('/auth', authRouter);
router.use('/products', productRouter);

module.exports = router;
