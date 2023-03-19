const router = require('express').Router();
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');
const commentRouter = require('./routes/comment.route');
const likeRouter = require('./routes/like.route');
const friendRouter = require('./routes/friend.route');
const shareRouter = require('./routes/share.route');
const saveRouter = require('./routes/save.route');

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/posts', postRouter);

router.use('/comments', commentRouter);

router.use('/likes', likeRouter);

router.use('/friends', friendRouter);

router.use('/shares', shareRouter);

router.use('/saves', saveRouter);

module.exports = router;
