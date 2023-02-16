const authService = require('../services/auth.service');
const catchAsync = require('../utilities/catchAsync');
const { sendOtp } = require('../utilities/token');

exports.signUpWithEmail = catchAsync(async (req, res, next) => {
  const { user, jwtToken } = await authService.signUpWithEmail(req.body, res);
  res.status(200).json({
    code: 200,
    data: user,
    token: jwtToken,
  });
});

exports.signUpWithPhone = catchAsync(async (req, res, next) => {
  await authService.signUpWithPhone(req.body, req.session);
  res.status(200).json({
    code: 200,
    message: `OTP was sent successfully. Please register it to signup.`,
  });
});

exports.otpVerification = catchAsync(async (req, res, next) => {
  const { user, jwtToken } = await authService.otpVerification(
    req.body.otp,
    req.session,
    res
  );
  res.status(200).json({
    code: 200,
    message: 'Verified successfully',
    data: user,
    token: jwtToken,
  });
});

exports.resendOtp = catchAsync(async (req, res, next) => {
  await sendOtp(req.session);
  res.status(200).json({
    code: 200,
    message: 'OTP has been resent successfully.',
  });
});

exports.logInWithEmail = catchAsync(async (req, res, next) => {
  const { user, jwtToken } = await authService.logInWithEmail(req.body, res);
  res.status(200).json({
    code: 200,
    data: user,
    token: jwtToken,
  });
});

exports.logInWithPhone = catchAsync(async (req, res, next) => {
  await authService.logInWithPhone(req.body, req.session);
  res.status(200).json({
    code: 200,
    message: `OTP was sent successfully. Please verify it to login.`,
  });
});

exports.otpVerificationLogin = catchAsync(async (req, res, next) => {
  const { user, jwtToken } = await authService.otpVerificationLogin(
    req.body.otp,
    req.session,
    res
  );
  res.status(200).json({
    code: 200,
    message: 'Verified successfully',
    data: user,
    token: jwtToken,
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  await authService.forgotPassword(req.body, req.session);
  res.status(200).json({
    code: 200,
    message: `Recovery OTP was sent to email.`,
  });
});

exports.recoveryOtpVerification = catchAsync(async (req, res, next) => {
  await authService.recoveryOtpVerification(req.body.otp, req.session.otp);
  next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await authService.resetPassword(req.body, req.session, res);
  res.status(200).json({
    code: 200,
    data: user,
  });
});
