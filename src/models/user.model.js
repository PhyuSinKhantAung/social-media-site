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
    last_access: {
      type: Date,
      default: '1970-01-01 00:00:00',
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
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

userSchema.methods.comparePassword = async function (
  userInputPassword,
  realPassword
) {
  const isMatchPassword = await bcrypt.compare(userInputPassword, realPassword);
  return isMatchPassword;
};

const User = model('User', userSchema);

module.exports = User;
