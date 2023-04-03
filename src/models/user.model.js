const { Schema, model, default: mongoose } = require('mongoose');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    dob: {
      type: Date,
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
    blocked_users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    blockers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
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
    bio: {
      type: String,
      default: 'Bio Text',
    },
  },
  {
    timestamps: true,
  }
);

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

const User = model('User', userSchema);

module.exports = User;
