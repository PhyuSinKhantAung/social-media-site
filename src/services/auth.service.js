const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const crypto = require('crypto');

const User = require('../models/user.model');
const { NotFoundError, BadRequestError, ApiError } = require('../errors');
const {
  JWT_SECRET,
  JWT_EXPIRES,
  COOKIES_EXPIRES,
  ACCOUNT_SID,
  SERVICE_ID,
  TWILIOPHNO,
  AUTH_TOKEN,
} = require('../constant');

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

////////////////////

const sendJWTToken = (user, res) => {
  // creating jwt token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
  // saving it into cookie
  const cookieOptions = {
    expires: new Date(Date.now() + COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);
  // deleting pw
  user.password = undefined;
  // sending jwt token
  return token;
};

/////////////////////

const createOtpToken = (otp) => {
  const expiredTime = Date.now() + 2 * 60 * 1000;
  const hashedOtp = crypto.createHash('sha256').update(`${otp}`).digest('hex');
  const otpToken = `${hashedOtp}.${expiredTime}`;
  return otpToken;
};

///////////////////

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

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpToken = createOtpToken(otp);
    reqSession.otp = otpToken;
    reqSession.user = reqBody;
    try {
      await client.messages.create({
        body: `Your Otp is ${otp}. Please keep it well, don't share it to anybody.`,
        from: TWILIOPHNO,
        to: reqBody.phone,
      });
    } catch (err) {
      throw new ApiError(
        'There is something went wrong while registering',
        400
      );
    }
  },

  otpVerification: async (userOtp, reqSession, res) => {
    const [otp, expiredTime] = reqSession.otp.split('.');
    const hashedUserOtp = crypto
      .createHash('sha256')
      .update(userOtp)
      .digest('hex');

    if (otp !== hashedUserOtp) throw new BadRequestError('Invalid otp.', 400);
    if (Date.now() > expiredTime)
      throw new BadRequestError('Your otp was expired.', 400);

    const user = await User.create(reqSession.user);
    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },

  resendOtp: async (reqSession) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpToken = createOtpToken(otp);
    reqSession.otp = otpToken;
    console.log(otp);
    try {
      await client.messages.create({
        body: `Your Otp is ${otp}. Please keep it well, don't share it to anybody.`,
        from: TWILIOPHNO,
        to: reqSession.user.phone,
      });
    } catch (err) {
      throw new ApiError(
        'There is something went wrong while registering',
        400
      );
    }
  },

  logInWithEmail: async (reqBody, res) => {
    if (!reqBody.email || reqBody.phone)
      throw new BadRequestError(
        'You must provide your email. This route is only for logging in with email',
        400
      );

    const user = await User.findOne({ email: reqBody.email }).select(
      '+password'
    );
    const isMatchPw = await user.comparePassword(
      reqBody.password,
      user.password
    );

    if (!user || !isMatchPw)
      throw new BadRequestError('Invalid email or password.', 400);
    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },

  logInWithPhone: async (reqBody, reqSession) => {
    if (!reqBody.phone || reqBody.email)
      throw new BadRequestError(
        'You must provide your phone number. This route is only for logging in with phone number',
        400
      );

    const user = await User.findOne({ phone: reqBody.phone });
    if (!user)
      throw new BadRequestError(
        'The user with this phone number does not exist.',
        400
      );

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpToken = createOtpToken(otp);
    reqSession.otp = otpToken;
    reqSession.user = reqBody;
    console.log(otp);
    try {
      await client.messages.create({
        body: `Your Otp is ${otp}. Please keep it well, don't share it to anybody.`,
        from: TWILIOPHNO,
        to: reqBody.phone,
      });
    } catch (err) {
      throw new ApiError(
        'There is something went wrong while registering',
        400
      );
    }
  },
  otpVerificationLogin: async (userOtp, reqSession, res) => {
    const [otp, expiredTime] = reqSession.otp.split('.');
    const hashedUserOtp = crypto
      .createHash('sha256')
      .update(userOtp)
      .digest('hex');

    if (otp !== hashedUserOtp) throw new BadRequestError('Invalid otp.', 400);
    if (Date.now() > expiredTime)
      throw new BadRequestError('Your otp was expired.', 400);

    const user = await User.findOne({ phone: reqSession.user.phone });
    const jwtToken = sendJWTToken(user, res);
    return { user, jwtToken };
  },
};

module.exports = authService;
