const { Schema, model, default: mongoose } = require('mongoose');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { BadRequestError, ApiError } = require('../errors');

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

    active: {
      type: Boolean,
      default: true,
    },
    last_access: {
      type: Date,
      default: '1970-01-01 00:00:00',
      select: false,
    },
    passwordChangedAt: {
      type: String,
      select: false,
    },
    // otp: {
    //   type: String,
    //   select: false,
    // },
    // passwordResetToken: {
    //   type: String,
    //   select: false,
    // },
    // passwordResetExpires: {
    //   type: String,
    //   select: false,
    // },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(/^find/, function (next) {
  this.populate({ path: 'saves', select: 'content images' });
  next();
});

userSchema.pre('save', async function (next) {
  // if password is modified, gonna hash / if not, will go another middleware
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function (
  userInputPassword,
  realPassword
) {
  const isMatchPassword = await bcrypt.compare(userInputPassword, realPassword);
  return isMatchPassword;
};

// userSchema.methods.compareOtp = async function (userOtp, realOtpToken) {
//   const [realOtp, expiredTime] = realOtpToken.split('.');
//   const hashedUserOtp = crypto
//     .createHash('sha256')
//     .update(userOtp)
//     .digest('hex');

//   if (Date.now() > expiredTime)
//     throw new BadRequestError('Your otp was expired.', 400);

//   if (realOtp !== hashedUserOtp) throw new ApiError('Incorrect otp.', 401);
// };

const User = model('User', userSchema);

module.exports = User;
