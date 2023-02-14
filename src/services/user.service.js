const { ApiError, BadRequestError } = require('../errors');
const User = require('../models/user.model');

const userService = {
  getAllUsers: async () => {
    const users = await User.find();
    return users;
  },
  getUser: async (userId, ownId) => {
    const user = await User.findById(userId);
    if (!user) throw new BadRequestError('There is no user with that id.', 400);
    if (user.blocks.find((blockedId) => blockedId.toString() === ownId))
      throw new ApiError('You have been blocked by this user', 400);

    return user;
  },
  updateMe: async (userId, reqBody, profilePic) => {
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
};

module.exports = userService;
