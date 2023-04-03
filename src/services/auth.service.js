const crypto = require('crypto');
const { sendJWTToken, generateOtpToken } = require('../utilities/token');
const User = require('../models/user.model');
const mail = require('../utilities/email');
const { USER_ERRORS, OTP_ERRORS } = require('../constant');

const authService = {
  signUpWithEmail: async (reqBody, res) => {
    const isEmailUsed = await User.findOne({
      email: reqBody.email ? reqBody.email : '',
    });

    if (isEmailUsed) throw USER_ERRORS.USER_ALREADY_EXISTS;

    const user = await User.create(reqBody);

    const jwtToken = sendJWTToken(user, res);

    return { user, jwtToken };
  },

  logInWithEmail: async (reqBody, res) => {
    const user = await User.findOne({ email: reqBody.email }).select(
      '+password'
    );

    if (!user) throw USER_ERRORS.USER_NOT_FOUND;

    if (!(await user.comparePassword(reqBody.password, user.password)))
      throw USER_ERRORS.WRONG_PASSWORD;

    if (user.active === false) {
      user.active = true;
      await user.save();
    }

    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },

  forgotPassword: async (reqBody, reqSession) => {
    const user = await User.findOne({ email: reqBody.email }).select(
      '+password'
    );

    if (!user) throw USER_ERRORS.USER_NOT_FOUND;

    const otp = Math.floor(100000 + Math.random() * 900000);

    const otpToken = generateOtpToken(otp);

    reqSession.otp = otpToken;
    reqSession.email = reqBody.email;

    await mail.sendRecoveryOtp(reqBody.email, otp);
  },

  resetPassword: async (reqBody, reqSession, res) => {
    const [otp, expiredTime] = reqSession.otp.split('.');
    const hashedUserOtp = crypto
      .createHash('sha256')
      .update(reqBody.otp)
      .digest('hex');

    if (otp !== hashedUserOtp) throw OTP_ERRORS.WRONG_OTP;

    if (Date.now() > expiredTime) throw OTP_ERRORS.EXPIRED_OTP;

    const user = await User.findOne({ email: reqSession.email });

    user.password = reqBody.password;
    await user.save();

    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },
};

module.exports = authService;
