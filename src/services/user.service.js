const { BLOCK_USER_ERRORS, USER_ERRORS } = require('../constant');

const User = require('../models/user.model');

const userService = {
  getAllUsers: async (reqQuery, ownId) => {
    const queryObj = { ...reqQuery };

    if (queryObj.username) {
      queryObj.username = { $regex: queryObj.username, $options: 'i' };
    }

    const users = await User.find(queryObj);

    const filteredBlockedUsers = users.filter((user) =>
      user.blocked_users.every(
        (blockedUserId) => blockedUserId.toString() !== ownId
      )
    );
    const filteredBlockers = filteredBlockedUsers.filter((user) =>
      user.blockers.every((blockerId) => blockerId.toString() !== ownId)
    );

    return filteredBlockers;
  },

  getUserById: async (userId, ownId) => {
    const user = await User.findById(userId);

    if (!user) throw USER_ERRORS.USER_NOT_FOUND;

    if (user.active === false) throw USER_ERRORS.USER_NOT_FOUND;

    if (user.blocked_users.find((blockedId) => blockedId.toString() === ownId))
      throw BLOCK_USER_ERRORS.USER_NOT_FOUND;

    return user;
  },

  updateMe: async (myId, reqBody, profilePic) => {
    if (!(await User.findById(myId))) throw USER_ERRORS.USER_NOT_FOUND;

    if (profilePic)
      reqBody.profile_pic = {
        url: profilePic.path,
      };

    const updatedUser = await User.findByIdAndUpdate(myId, reqBody, {
      new: true,
    });
    return updatedUser;
  },

  deactivateMe: async (myId, res) => {
    if (!(await User.findById(myId))) throw USER_ERRORS.USER_NOT_FOUND;

    await User.findByIdAndUpdate(myId, { active: false });

    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  },
};

module.exports = userService;
