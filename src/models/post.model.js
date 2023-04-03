const { Schema, model, default: mongoose } = require('mongoose');

const postSchema = new Schema(
  {
    post_creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    taggedUserIds: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    audience: {
      type: String,
      enum: ['PUBLIC', 'FRIEND'],
      default: 'PUBLIC',
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
        default: [],
      },
    ],
    saves: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
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

const Post = model('Post', postSchema);

module.exports = Post;
