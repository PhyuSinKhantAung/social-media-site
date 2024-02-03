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
    const [tokenType, jwtToken] = req.headers.authorization.split(' ');

    if (tokenType !== 'Bearer') throw USER_ERRORS.NOT_AUTHENTICATED;

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
