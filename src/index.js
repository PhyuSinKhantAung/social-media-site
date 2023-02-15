const router = require('express').Router();
const postRouter = require('./routes/post.route');
const authRouter = require('./routes/auth.route');
const shareRouter = require('./routes/share.route');
const friendRouter = require('./routes/friend.route');
const saveRouter = require('./routes/save.route');
const userRouter = require('./routes/user.route');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/friends', friendRouter);

router.use('/shares', shareRouter);
router.use('/saves', saveRouter);

module.exports = router;
