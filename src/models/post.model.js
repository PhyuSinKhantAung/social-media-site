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
      },
    ],
    // tags: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     default: [],
    //   },
    // ],
    friends: [
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
    audience: {
      type: String,
      default: 'friend',
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

postSchema.virtual('like_count').get(function () {
  return this.likes.length;
});

postSchema.pre('save', function (next) {
  if (this.isNew) next();
  this.comment_count = this.comments.length;
  this.like_count = this.likes.length;

  return next;
});

const Post = model('Post', postSchema);

module.exports = Post;
