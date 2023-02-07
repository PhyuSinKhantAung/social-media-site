const { Schema, model } = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: String,
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
    },
    profile_pic: {
      filename: String,
      url: String,
    },
    otp: {
      type: String,
      select: false,
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

userSchema.methods.comparePassword = async function (userInputPw, realPw) {
  const isMatchPw = await bcrypt.compare(userInputPw, realPw);
  return isMatchPw;
};

const User = model('User', userSchema);

module.exports = User;
