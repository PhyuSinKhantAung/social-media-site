const catchAsync = require('../utilities/catchAsync');
const saveService = require('../services/save.service');
const successResponse = require('../utilities/successResponse');

const savePostController = {
  createSave: catchAsync(async (req, res, next) => {
    await saveService.createSave(req.params.id, req.user.id);
    successResponse({
      res,
      code: 200,
      message: 'You saved this post successfully.',
    });
  }),

  unsaved: catchAsync(async (req, res, next) => {
    await saveService.unsaved(req.params.id, req.user.id);
    successResponse({ res, code: 200, message: 'You unsaved this post.' });
  }),

  getAllSavedPosts: catchAsync(async (req, res, next) => {
    const savedPosts = await saveService.getAllSavedPosts(req.user.id);
    successResponse({ res, code: 200, data: savedPosts });
  }),

  getSavedPost: catchAsync(async (req, res, next) => {
    const savedPost = await saveService.getSavedPost(
      req.params.id,
      req.user.id
    );
    successResponse({ res, code: 200, data: savedPost });
  }),
};

module.exports = savePostController;
