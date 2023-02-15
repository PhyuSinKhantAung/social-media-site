const userService = require('../services/user.service');
const catchAsync = require('../utilities/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    code: 200,
    data: users,
    count: users.length,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUser(req.params.id, req.user.id);
  res.status(200).json({
    code: 200,
    data: user,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await userService.getMe(req.user.id);
  res.status(200).json({
    code: 200,
    data: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const updatedUser = await userService.updateMe(
    req.user.id,
    req.body,
    req.file
  );
  res.status(200).json({
    code: 200,
    data: updatedUser,
  });
});

exports.deactivateMe = catchAsync(async (req, res, next) => {
  await userService.deactivateMe(req.user.id, res);
  res.status(200).json({
    code: 200,
    data: null,
    message: 'Deactivated successfully.',
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await userService.deleteMe(req.user.id, res);
  res.status(200).json({
    code: 200,
    data: null,
  });
});
