const { Schema, model, default: mongoose } = require('mongoose');

const commentSchema = new Schema({
  text: {
    type: String,
  },
  commented_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  commented_postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  },
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
