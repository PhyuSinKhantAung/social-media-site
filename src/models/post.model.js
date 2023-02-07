const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema(
  {
    desc: {
      type: String,
    },
    images: [
      {
        url: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    comments: [
      {
        user_id: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        text: String,
        default: [],
      },
    ],
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('comment_count').get(function () {
  return this.comments.length;
});

postSchema.pre('save', function (next) {
  if (!this.isModified('comments') || this.isNew) next();
  this.comment_count = this.comments.length;
  return next;
});

const Post = model('Post', postSchema);

module.exports = Post;
