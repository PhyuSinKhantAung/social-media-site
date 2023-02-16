const crypto = require('crypto');

const { NotFoundError, BadRequestError, ApiError } = require('../errors');
const { sendJWTToken, sendOtp, createOtpToken } = require('../utilities/token');
const User = require('../models/user.model');
const sendMail = require('../utilities/email');

const authService = {
  signUpWithEmail: async (reqBody, res) => {
    if (!reqBody.email)
      throw new NotFoundError(
        'You must provide email. This route is for signing up with email.',
        404
      );

    const isEmailUsed = await User.findOne({ email: reqBody.email });
    if (isEmailUsed) throw new BadRequestError('Email already exists.', 400);

    const user = await User.create(reqBody);

    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },

  signUpWithPhone: async (reqBody, reqSession) => {
    if (!reqBody.phone)
      throw new NotFoundError(
        'You must provide your phone number. This route is for signing up with phone number.',
        404
      );

    const isPhoneUsed = await User.findOne({ phone: reqBody.phone });
    if (isPhoneUsed)
      throw new BadRequestError('Phone number already exists.', 400);

    reqSession.user = reqBody;

    await sendOtp(reqSession);
  },

  otpVerification: async (userOtp, reqSession, res) => {
    const [otp, expiredTime] = reqSession.otp.split('.');
    const hashedUserOtp = crypto
      .createHash('sha256')
      .update(userOtp)
      .digest('hex');

    if (otp !== hashedUserOtp) throw new ApiError('Incorrect otp.', 401);

    if (Date.now() > expiredTime)
      throw new BadRequestError('Your otp was expired.', 400);

    const user = await User.create(reqSession.user);
    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },

  logInWithEmail: async (reqBody, res) => {
    const { email, password } = reqBody;
    if (!email || !password)
      throw new BadRequestError(
        'You must provide your email and password.',
        400
      );

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ApiError('Incorrect Email.', 401);

    if (!(await user.comparePassword(reqBody.password, user.password)))
      throw new ApiError('Incorrect password.', 401);

    if (user.active === false) {
      user.active = true;
      await user.save();
    }
    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },

  logInWithPhone: async (reqBody, reqSession) => {
    if (!reqBody.phone || reqBody.email)
      throw new NotFoundError(
        'You must provide your phone number. This route is only for logging in with phone number',
        404
      );

    if (!(await User.findOne({ phone: reqBody.phone })))
      throw new BadRequestError(
        'The user with this phone number does not exist.',
        400
      );

    reqSession.user = reqBody;
    sendOtp(reqSession);
  },

  otpVerificationLogin: async (userOtp, reqSession, res) => {
    const [otp, expiredTime] = reqSession.otp.split('.');
    const hashedUserOtp = crypto
      .createHash('sha256')
      .update(userOtp)
      .digest('hex');

    if (otp !== hashedUserOtp) throw new ApiError('Incorrect otp.', 401);

    if (Date.now() > expiredTime)
      throw new BadRequestError('Your otp was expired.', 400);

    const user = await User.findOne({ phone: reqSession.user.phone });

    if (user.active === false) {
      user.active = true;
      await user.save();
    }
    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },

  forgotPassword: async (reqBody, reqSession) => {
    const { email } = reqBody;
    const user = await User.findOne({ email });
    if (!user)
      throw new NotFoundError('There is no user with that email.', 404);

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpToken = createOtpToken(otp);
    reqSession.otp = otpToken;
    reqSession.email = email;

    await sendMail.sendRecoveryOtp(email, otp);
  },

  recoveryOtpVerification: async (userOtp, realOtp) => {
    if (!userOtp)
      throw new BadRequestError(
        'This route is only for verifying recovery otp.',
        400
      );

    const [otp, expiredTime] = realOtp.split('.');
    const hashedUserOtp = crypto
      .createHash('sha256')
      .update(userOtp)
      .digest('hex');

    if (otp !== hashedUserOtp) throw new ApiError('Incorrect otp.', 401);

    if (Date.now() > expiredTime)
      throw new BadRequestError('Your otp was expired.', 400);
  },

  resetPassword: async (reqBody, reqSession, res) => {
    if (!reqBody.password)
      throw new BadRequestError('You must provide your new password.', 400);
    const user = await User.findOne({ email: reqSession.email });

    user.password = reqBody.password;
    await user.save();

    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },
};

module.exports = authService;
