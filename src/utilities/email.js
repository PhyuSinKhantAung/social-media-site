const nodemailer = require('nodemailer');
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
} = require('../constant');
const { ApiError } = require('../errors');

const createTransport = () =>
  nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

const sendMessage = async (messageConfiguration) => {
  const transporter = createTransport();
  try {
    await transporter.sendMail({
      from: 'socialsite@gmail.com',
      ...messageConfiguration,
    });
  } catch (err) {
    throw new ApiError('There is somthing went wrong while sending mail.', 400);
  }
};

exports.sendRecoveryOtp = async (to, data) => {
  await sendMessage({
    to,
    subject: `${data} is your recovery OTP code.`,
    text: `${data} use this code to reset your password. `,
  });
};
