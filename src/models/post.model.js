const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema(
  {
    content: {
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
        commented_by: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        text: String,
      },
    ],
    taggedUserIds: [
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
      enum: ['PUBLIC', 'FRIEND'],
      default: 'PUBLIC',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
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

postSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name profile_pic' }).populate({
    path: 'taggedUserIds',
    select: 'name profile_pic',
  });
  next();
});

const Post = model('Post', postSchema);

module.exports = Post;
