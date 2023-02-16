const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const twilio = require('twilio');

const {
  JWT_SECRET,
  JWT_EXPIRES,
  COOKIES_EXPIRES,
  AUTH_TOKEN,
  ACCOUNT_SID,
  TWILIOPHNO,
} = require('../constant');
const { ApiError } = require('../errors');

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
  user.last_access = undefined;

  // sending jwt token
  return token;
};

const createOtpToken = (otp) => {
  const expiredTime = Date.now() + 2 * 60 * 1000;
  const hashedOtp = crypto.createHash('sha256').update(`${otp}`).digest('hex');
  const otpToken = `${hashedOtp}.${expiredTime}`;
  return otpToken;
};

const sendOtp = async (reqSession) => {
  const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
  console.log(ACCOUNT_SID);
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpToken = createOtpToken(otp);
  reqSession.otp = otpToken;
  console.log(reqSession.user.phone);
  try {
    await client.messages.create({
      body: `Your Otp is ${otp}. Please keep it well, don't share it to anybody.`,
      from: TWILIOPHNO,
      to: reqSession.user.phone,
    });
  } catch (err) {
    console.log(err);
    throw new ApiError('There is something went wrong while registering', 400);
  }
};

module.exports = { sendJWTToken, createOtpToken, sendOtp };
