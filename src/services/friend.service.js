const { ObjectId } = require('mongodb');
const { BadRequestError } = require('../errors');
const Friend = require('../models/friend.model');
const User = require('../models/user.model');

const friendService = {
  addFriend: async (wantToaddId, userId) => {
    const user = await User.findById(wantToaddId);
    if (!user)
      throw new BadRequestError('The user with that id does not exist.', 400);

    const isUserBlock = user.blocks.find(
      (blockId) => blockId.toString() === userId
    );
    if (isUserBlock)
      throw new BadRequestError('You have been blocked by this user.', 400);

    const isRequested = await Friend.findOne({
      $or: [
        {
          receiverId: wantToaddId, //rolly => ps
          requesterId: userId, // ps => rolly
        },
        { receiverId: userId, requesterId: wantToaddId },
      ],
    });
    if (isRequested)
      throw new BadRequestError(
        'There is something wrong while adding friend.',
        400
      );

    const addFriendInfo = await Friend.create({
      receiverId: wantToaddId,
      requesterId: userId,
    });

    return addFriendInfo;
  },
  getAllFriendRequests: async (userId) => {
    const friendRequests = await Friend.find({
      receiverId: userId,
      relationship: 'REQUEST',
    });
    return friendRequests;
  },
  confirmFriend: async (wantToConfirmId, userId) => {
    await Friend.findOneAndUpdate(
      {
        receiverId: userId,
        requesterId: wantToConfirmId,
        relationship: 'REQUEST',
      },
      { relationship: 'FRIEND' },
      { new: true }
    );
    const confirmFriend = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { friends: wantToConfirmId },
      },
      { new: true, runValidators: true }
    );
    return confirmFriend;
  },

  unfriend: async (wantToUnfriId, userId) => {
    await Friend.findOneAndDelete({
      receiverId: userId || wantToUnfriId,
      requesterId: wantToUnfriId || userId,
      relationship: 'FRIEND',
    });

    const unfriend = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { friends: wantToUnfriId },
      },
      { new: true, runValidators: true }
    );

    return unfriend;
  },

  blockFriend: async (wantToBlockId, userId) => {
    const relationBetween = await Friend.findOneAndUpdate(
      {
        $or: [
          {
            receiverId: userId,
            requesterId: wantToBlockId,
          },
          {
            receiverId: wantToBlockId,
            requesterId: userId,
          },
        ],
      },
      {
        receiverId: wantToBlockId,
        requesterId: userId,
        relationship: 'BLOCK',
      },
      {
        new: true,
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friends: wantToBlockId },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    const blockFriend = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { blocks: wantToBlockId } },
      {
        runValidators: true,
        new: true,
      }
    );

    return blockFriend;
  },

  unblock: async (wantToUnblockId, userId) => {
    const isBlock = await Friend.findOneAndDelete({
      $or: [
        {
          receiverId: userId,
          requesterId: wantToUnblockId,
          relationship: 'BLOCK',
        },
        {
          receiverId: wantToUnblockId,
          requesterId: userId,
          relationship: 'BLOCK',
        },
      ],
    });

    if (!isBlock)
      throw new BadRequestError(
        'You cannot unblock this user without blocking.',
        400
      );

    const unblockFriend = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { blocks: wantToUnblockId },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return unblockFriend;
  },

  getAllFriends: async (userId) => {
    const user = await User.findById(userId).populate({
      path: 'friends',
      select: 'name profile_pic',
    });
    return user.friends;
  },
  getAllBlocks: async (userId) => {
    const user = await User.findById(userId).populate({
      path: 'blocks',
      select: 'name profile_pic',
    });
    return user.blocks;
  },
};

module.exports = friendService;
