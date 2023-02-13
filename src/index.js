const router = require('express').Router();
const postRouter = require('./routes/post.route');
const authRouter = require('./routes/auth.route');
const shareRouter = require('./routes/share.route');
const friendRouter = require('./routes/friend.route');

router.use('/auth', authRouter);
router.use('/posts', postRouter);
router.use('/friends', friendRouter);

router.use('/share', shareRouter);

module.exports = router;
