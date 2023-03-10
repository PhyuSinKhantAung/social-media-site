const { ApiError, BadRequestError } = require('../errors');
const User = require('../models/user.model');

const userService = {
  getAllUsers: async (reqQuery, ownId) => {
    const queryObj = { ...reqQuery };
    if (queryObj.username) {
      queryObj.username = { $regex: queryObj.username, $options: 'i' };
    }
    const users = await User.find(queryObj);

    const isBlocked = users.filter((user) =>
      user.blocks.some((blockedId) => blockedId.toString() === ownId)
    );
    if (isBlocked.length !== 0)
      throw new ApiError('You have been blocked by this user.', 404);

    return users;
  },

  getUser: async (userId, ownId) => {
    const user = await User.findById(userId);

    if (!user) throw new BadRequestError('There is no user with that id.', 400);

    if (user.active === false)
      throw new BadRequestError('This user is not available right now.', 400);

    if (user.blocks.find((blockedId) => blockedId.toString() === ownId))
      throw new ApiError('You have been blocked by this user.', 404);

    return user;
  },

  getMe: async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new BadRequestError('There is no user with that id', 400);
    return user;
  },

  updateMe: async (userId, reqBody, profilePic) => {
    console.log(profilePic);
    if (!(await User.findById(userId)))
      throw new BadRequestError('There is no user with that id', 400);

    if (reqBody.password)
      throw new BadRequestError(
        'You cannot update password on this route',
        400
      );

    if (profilePic)
      reqBody.profile_pic = {
        url: profilePic.path,
      };

    const updatedUser = await User.findByIdAndUpdate(userId, reqBody, {
      new: true,
    });
    return updatedUser;
  },

  deactivateMe: async (userId, res) => {
    if (!(await User.findById(userId)))
      throw new BadRequestError('There is no user with that id', 400);

    await User.findByIdAndUpdate(userId, { active: false });

    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  },

  deleteMe: async (userId, res) => {
    if (!(await User.findById(userId)))
      throw new BadRequestError('There is no user with that id', 400);

    await User.findByIdAndDelete(userId);

    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  },
};

module.exports = userService;
