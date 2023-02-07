const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constant');
const { ApiError } = require('../errors');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user.model');

const authenticate = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const [bearer, jwtToken] = req.headers.authorization.split(' ');
    // token = req.headers.authorization.split(' ')[1];
    token = jwtToken;
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    throw new ApiError(
      'You are not logged in. Please login to get access.',
      401
    );

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log(payload);
    const user = await User.findById(payload.id);
    if (!user)
      throw new ApiError('User belong to this id does not exist.', 400);
    req.user = user;
  } catch (err) {
    next(err);
  }
});

module.exports = authenticate;
