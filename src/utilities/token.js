const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { JWT_SECRET, JWT_EXPIRES, COOKIES_EXPIRES } = require('../constant');

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

const generateOtpToken = (otp) => {
  const expiredTime = Date.now() + 2 * 60 * 1000;
  const hashedOtp = crypto.createHash('sha256').update(`${otp}`).digest('hex');
  const otpToken = `${hashedOtp}.${expiredTime}`;
  return otpToken;
};

module.exports = { sendJWTToken, generateOtpToken };
