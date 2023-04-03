const postService = require('../services/post.service');
const catchAsync = require('../utilities/catchAsync');
const successResponse = require('../utilities/successResponse');

const postController = {
  getAllposts: catchAsync(async (req, res, next) => {
    const posts = await postService.getAllposts(req.user, req.query);
    successResponse({ res, code: 200, data: posts });
  }),
  getAllMyPosts: catchAsync(async (req, res, next) => {
    const posts = await postService.getAllMyPosts(req.user);
    successResponse({ res, code: 200, data: posts });
  }),

  getUserAllPosts: catchAsync(async (req, res, next) => {
    const posts = await postService.getUserAllPosts(req.params.userId);
    successResponse({ res, code: 200, data: posts });
  }),

  getPost: catchAsync(async (req, res, next) => {
    console.log('hello run me please');
    const post = await postService.getPost(req.params.id);
    successResponse({ res, code: 200, data: post });
  }),

  createPost: catchAsync(async (req, res, next) => {
    const post = await postService.createPost(req.body, req.user, req.files);
    successResponse({ res, code: 200, data: post });
  }),

  updatePost: catchAsync(async (req, res, next) => {
    const post = await postService.updatePost(
      req.body,
      req.user,
      req.params.id,
      req.files
    );
    successResponse({ res, code: 200, data: post });
  }),

  deleteImages: catchAsync(async (req, res, next) => {
    const deletedImgPost = await postService.deleteImages(
      req.body,
      req.user,
      req.params.id
    );
    successResponse({ res, code: 200, data: deletedImgPost });
  }),

  deletePost: catchAsync(async (req, res, next) => {
    await postService.deletePost(req.params.id, req.user);
    successResponse({ res, code: 200, data: null });
  }),
};

module.exports = postController;
