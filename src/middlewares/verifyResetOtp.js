const crypto = require('crypto');
const { ApiError, BadRequestError } = require('../errors');
const catchAsync = require('../utilities/catchAsync');

const verifyResetOtp = catchAsync(async (req, res, next) => {
  const [otp, expiredTime] = req.session.otp.split('.');
  const hashedUserOtp = crypto
    .createHash('sha256')
    .update(req.body.otp)
    .digest('hex');

  if (Date.now() > expiredTime)
    throw new BadRequestError('Your otp was expired.', 400);

  if (otp !== hashedUserOtp) throw new ApiError('Incorrect otp.', 401);
  else next();
});


module.exports = verifyResetOtp;