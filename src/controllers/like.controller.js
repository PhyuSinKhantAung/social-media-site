const catchAsync = require('../utilities/catchAsync');
const likeService = require('../services/like.service');
const successResponse = require('../utilities/successResponse');

const likeController = {
  getAllLikes: catchAsync(async (req, res, next) => {
    const likes = await likeService.getAllLikes(req.params.id);
    successResponse({ res, code: 200, data: likes });
  }),

  createlike: catchAsync(async (req, res, next) => {
    await likeService.createlike(req.params.id, req.user.id);
    successResponse({ res, code: 200, message: 'You like it' });
  }),

  unlike: catchAsync(async (req, res, next) => {
    await likeService.unlike(req.params.id, req.user.id);
    successResponse({ res, code: 200, message: 'You unlike it' });
  }),
};

module.exports = likeController;
