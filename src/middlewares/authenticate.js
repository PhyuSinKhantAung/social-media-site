const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constant');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user.model');
const { USER_ERRORS } = require('../constant');

const authenticate = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line no-unused-vars
    const [bearer, jwtToken] = req.headers.authorization.split(' ');
    token = jwtToken;
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) throw USER_ERRORS.NOT_AUTHENTICATED;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) throw USER_ERRORS.USER_NOT_FOUND;
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = authenticate;
