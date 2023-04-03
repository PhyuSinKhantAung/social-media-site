const userService = require('../services/user.service');
const catchAsync = require('../utilities/catchAsync');
const successResponse = require('../utilities/successResponse');

const userController = {
  getAllUsers: catchAsync(async (req, res, next) => {
    const users = await userService.getAllUsers(req.query, req.user.id);
    successResponse({ res, code: 200, data: users });
  }),

  getUserById: catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id, req.user.id);
    successResponse({ res, code: 200, data: user });
  }),

  getMe: catchAsync(async (req, res, next) => {
    successResponse({ res, code: 200, data: req.user });
  }),

  updateMe: catchAsync(async (req, res, next) => {
    const updatedUser = await userService.updateMe(
      req.user.id,
      req.body,
      req.file
    );
    successResponse({ res, code: 200, data: updatedUser });
  }),

  deactivateMe: catchAsync(async (req, res, next) => {
    await userService.deactivateMe(req.user.id, res);
    successResponse({ res, code: 200, data: null });
  }),
};

module.exports = userController;
