const postService = require('../services/post.service');
const catchAsync = require('../utilities/catchAsync');

exports.getAllposts = catchAsync(async (req, res, next) => {
  const posts = await postService.getAllposts();
  res.status(200).json({
    code: 200,
    data: posts,
    count: posts.length,
  });
});

exports.getAllMyPosts = catchAsync(async (req, res, next) => {
  const posts = await postService.getAllMyPosts(req.user);
  res.status(200).json({
    code: 200,
    data: posts,
    count: posts.length,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await postService.createPost(req.body, req.user);
  res.status(200).json({
    code: 200,
    data: post,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await postService.updatePost(req.body, req.params.id);
  res.status(200).json({
    code: 200,
    data: post,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  await postService.deletePost(req.params.id);
  res.status(200).json({
    code: 200,
    data: null,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await postService.getPost(req.params.id);
  res.status(200).json({
    code: 200,
    data: post,
  });
});
