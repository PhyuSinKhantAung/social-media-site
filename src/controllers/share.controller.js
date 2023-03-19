const catchAsync = require('../utilities/catchAsync');
const shareService = require('../services/share.service');
const successResponse = require('../utilities/successResponse');

const shareController = {
  createShare: catchAsync(async (req, res, next) => {
    await shareService.createShare(req.params.id, req.user.id, req.body);
    successResponse({
      res,
      code: 200,
      data: null,
      message: 'You shared this post successfully.',
    });
  }),

  updateShare: catchAsync(async (req, res, next) => {
    const updatedSharePost = await shareService.updateShare(
      req.params.id,
      req.user.id,
      req.body
    );
    successResponse({
      res,
      code: 200,
      data: updatedSharePost,
    });
  }),

  deleteShare: catchAsync(async (req, res, next) => {
    await shareService.deleteShare(req.params.id, req.user.id);
    successResponse({ res, code: 200, data: null });
  }),

  getSharedPost: catchAsync(async (req, res, next) => {
    const sharedPost = await shareService.getSharedPost(req.params.id);
    successResponse({
      res,
      code: 200,
      data: sharedPost,
    });
  }),
};

module.exports = shareController;
