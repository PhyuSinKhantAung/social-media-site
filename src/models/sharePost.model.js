const { Schema, model, default: mongoose } = require('mongoose');

const shareSchema = new Schema(
  {
    caption: String,
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
    sharedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    audience: {
      type: String,
      enum: ['PUBLIC', 'FRIEND'],
      default: 'PUBLIC',
    },
    taggedUserIds: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// shareSchema.pre(/^find/, function (next) {
//   this.populate('post').populate({
//     path: 'sharedBy',
//     select: 'username profile_pic',
//   });
//   next();
// });

const Share = model('Share', shareSchema);

module.exports = Share;
