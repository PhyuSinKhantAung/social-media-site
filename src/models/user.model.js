const { Schema, model, default: mongoose } = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
    },
    profile_pic: {
      url: String,
    },
    friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    mutual_friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    blocks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    saves: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        default: [],
      },
    ],
    otp: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre(/^findById/, function (next) {
//   this.populate('saves');
//   next();
// });

// userSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'saves', select: 'content images' });
//   next();
// });

userSchema.pre('save', async function (next) {
  // if password is modified, gonna hash / if not, will go another middleware
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (userInputPw, realPw) {
  const isMatchPw = await bcrypt.compare(userInputPw, realPw);
  return isMatchPw;
};

const User = model('User', userSchema);

module.exports = User;
