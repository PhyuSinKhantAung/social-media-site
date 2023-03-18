const { Schema, model, default: mongoose } = require('mongoose');

const friendSchema = new Schema({
  receiverId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  requesterId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  relationship: {
    type: String,
    default: 'REQUEST',
  },
});

friendSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'requesterId',
    select: 'username profile_pic',
  });
  next();
});

const Friend = model('Friend', friendSchema);

module.exports = Friend;
