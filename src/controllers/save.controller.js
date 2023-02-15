const catchAsync = require('../utilities/catchAsync');
const saveService = require('../services/save.service');

exports.createSave = catchAsync(async (req, res, next) => {
  const savePost = await saveService.createSave(req.user.id, req.params.id);
  res.status(200).json({
    code: 200,
    data: savePost,
  });
});

exports.unsaved = catchAsync(async (req, res, next) => {
  const unsavedPost = await saveService.unsaved(req.user.id, req.params.id);
  res.status(200).json({
    code: 200,
    data: unsavedPost,
  });
});

exports.getAllSavedPosts = catchAsync(async (req, res, next) => {
  const savedPosts = await saveService.getAllSavedPosts(req.user.id);
  res.status(200).json({
    code: 200,
    data: savedPosts,
  });
});

// getSavedPost;

exports.getSavedPost = catchAsync(async (req, res, next) => {
  const savedPosts = await saveService.getSavedPost(req.user.id, req.params.id);
  res.status(200).json({
    code: 200,
    data: savedPosts,
  });
});
