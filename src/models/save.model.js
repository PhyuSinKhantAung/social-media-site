const { Schema, model, default: mongoose } = require('mongoose');

const saveSchema = new Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  },
  saveBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const Save = model('Share', saveSchema);

module.exports = Save;
