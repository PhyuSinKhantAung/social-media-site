const { Schema, model, default: mongoose } = require('mongoose');

const saveSchema = new Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
    savedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Save = model('Save', saveSchema);

module.exports = Save;
