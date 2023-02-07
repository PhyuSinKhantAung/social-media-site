const authService = require('../services/auth.service');
const catchAsync = require('../utilities/catchAsync');

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
  await authService.resendOtp(req.session);
  res.status(200).json({
    code: 200,
    message: 'OTP was resent successfully.',
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
