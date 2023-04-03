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

const Request = model('Request', friendRequestSchema);

module.exports = Request;
