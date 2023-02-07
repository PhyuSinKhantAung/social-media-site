const router = require('express').Router();
const postRouter = require('./routes/post.route');
const authRouter = require('./routes/auth.route');

router.use('/auth', authRouter);
router.use('/posts', postRouter);

module.exports = router;
