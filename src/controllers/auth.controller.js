const authService = require('../services/auth.service');
const catchAsync = require('../utilities/catchAsync');
const successResponse = require('../utilities/successResponse');

const authController = {
  signUpWithEmail: catchAsync(async (req, res, next) => {
    const { user, jwtToken } = await authService.signUpWithEmail(req.body, res);
    successResponse({ res, code: 201, data: user, token: jwtToken });
  }),

  logInWithEmail: catchAsync(async (req, res, next) => {
    const { user, jwtToken } = await authService.logInWithEmail(req.body, res);
    successResponse({ res, code: 200, data: user, token: jwtToken });
  }),

  forgotPassword: catchAsync(async (req, res, next) => {
    await authService.forgotPassword(req.body, req.session);
    successResponse({
      res,
      code: 200,
      data: null,
      message: 'Recovery OTP has been sent to your email successfully.',
    });
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    const { user, jwtToken } = await authService.resetPassword(
      req.body,
      req.session,
      res
    );
    successResponse({ res, code: 200, data: user, token: jwtToken });
  }),

  logout: (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    successResponse({ res, code: 200, data: null });
  },
};

module.exports = authController;
