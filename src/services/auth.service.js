const { sendJWTToken } = require('../utilities/token');
const User = require('../models/user.model');
const { USER_ERRORS } = require('../constant');

const authService = {
  signUpWithEmail: async (reqBody, res) => {
    const isEmailUsed = await User.findOne({
      email: reqBody.email,
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
};

module.exports = authService;
