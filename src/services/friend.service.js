const { ObjectId } = require('mongodb');
const { USER_ERRORS, FRIEND_REQUEST_ERRORS } = require('../constant');
const Request = require('../models/friendRequest.model');
const User = require('../models/user.model');

const friendService = {
  addFriend: async (receiverId, senderId) => {
    const user = await User.findById(receiverId);

    if (!user) throw USER_ERRORS.USER_NOT_FOUND;

    if (receiverId === senderId) throw FRIEND_REQUEST_ERRORS.NOT_ADD_YOURSELF;

    const isUserBlock = user.blocked_users.find(
      (blockedFriendId) => blockedFriendId.toString() === senderId
    );

    if (isUserBlock) throw FRIEND_REQUEST_ERRORS.USER_BLOCKED;

    const isRequested = await Request.findOne({
      $or: [
        {
          receiverId: receiverId, //rolly => pos
          senderId: senderId, // ps => rolly
        },
        {
          receiverId: senderId,
          requesterId: receiverId,
        },
      ],
    });

    if (isRequested) throw FRIEND_REQUEST_ERRORS.CONFILCT_FRIEND_REQUEST;

    await Request.create({
      receiverId,
      senderId,
    });
  },

  getAllFriendRequests: async (userId) => {
    const friendRequests = await Request.find({
      receiverId: userId,
    })
      .select('-receiverId')
      .populate({
        path: 'senderId',
        select: 'username profile_pic',
      });

    if (!friendRequests) throw FRIEND_REQUEST_ERRORS.REQUEST_NOT_FOUND;

    return friendRequests;
  },

  confirmFriend: async (senderId, receiverId) => {
    const request = await Request.findOneAndDelete({
      receiverId: receiverId,
      senderId: senderId,
    });

    if (!request) throw FRIEND_REQUEST_ERRORS.REQUEST_NOT_FOUND;

    await User.findByIdAndUpdate(
      receiverId,
      {
        $addToSet: { friends: senderId },
      },
      { new: true, runValidators: true }
    );

    // also push userId into wantToConfirm user's friends field
    await User.findByIdAndUpdate(
      senderId,
      {
        $addToSet: { friends: receiverId },
      },
      { new: true, runValidators: true }
    );
  },

  cancelRequest: async (senderId, receiverId) => {
    await Request.findOneAndDelete({
      $or: [
        {
          receiverId: receiverId,
          senderId: senderId,
        },
        {
          receiverId: senderId,
          senderId: receiverId,
        },
      ],
    });
  },

  unfriend: async (senderId, receiverId) => {
    const user = await User.findById(receiverId);
    const isFriend = user.friends.includes(ObjectId(senderId));

    if (!isFriend) throw FRIEND_REQUEST_ERRORS.FRIEND_USER_NOT_FOUND;

    await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { friends: senderId },
      },
      { new: true, runValidators: true }
    );

    // also pull userId into wantToUnfri user's friends field
    await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { friends: receiverId },
      },
      { new: true, runValidators: true }
    );
  },

  blockUser: async (blockedUserId, blockerId) => {
    const user = await User.findById(blockedUserId);

    if (!user) throw USER_ERRORS.USER_NOT_FOUND;

    await User.findByIdAndUpdate(
      blockerId,
      {
        $pull: { friends: blockedUserId },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(
      blockedUserId,
      {
        $pull: { friends: blockerId },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(
      blockerId,
      { $addToSet: { blocked_users: blockedUserId } },
      {
        runValidators: true,
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      blockedUserId,
      { $addToSet: { blockers: blockerId } },
      {
        runValidators: true,
        new: true,
      }
    );
  },

  unblockUser: async (unblockedUserId, unblockerId) => {
    const user = await User.findById(unblockerId);

    const isBlock = user.blocked_users.includes(ObjectId(unblockedUserId));

    if (!isBlock) throw FRIEND_REQUEST_ERRORS.BLOCKED_USER_NOT_FOUND;

    await User.findByIdAndUpdate(
      unblockerId,
      {
        $pull: { blocked_users: unblockedUserId },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(
      unblockedUserId,
      { $pull: { blockers: unblockerId } },
      {
        runValidators: true,
        new: true,
      }
    );
  },

  getAllFriends: async (userId) => {
    const user = await User.findById(userId).populate({
      path: 'friends',
      select: 'username profile_pic',
    });
    return user.friends;
  },

  getAllBlockedUsers: async (userId) => {
    const user = await User.findById(userId).populate({
      path: 'blocked_users',
      select: 'username profile_pic',
    });
    return user.blocked_users;
  },

  getMutualFriends: async (targetUserId, myId) => {
    const user = await User.findById(targetUserId);

    if (!user) throw USER_ERRORS.USER_NOT_FOUND;

    const me = await User.findById(myId);

    const mutualFriends = user.friends.filter((userFriId) =>
      me.friends.some((myFriId) => myFriId.toString() === userFriId.toString())
    );

    const updatedUser = await User.findByIdAndUpdate(targetUserId, {
      $set: { mutual_friends: mutualFriends },
    }).populate({ path: 'mutual_friends', select: 'username profile_pic' });

    return updatedUser.mutual_friends;
  },
};

module.exports = friendService;
