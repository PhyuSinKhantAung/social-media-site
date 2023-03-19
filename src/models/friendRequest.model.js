const { Schema, model, default: mongoose } = require('mongoose');

const friendRequestSchema = new Schema({
  receiverId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

// friendRequestSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'senderId',
//     select: 'username profile_pic',
//   });
//   next();
// });

const Request = model('Request', friendRequestSchema);

module.exports = Request;
