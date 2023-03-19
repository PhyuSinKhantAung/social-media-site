exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
exports.PORT = process.env.PORT || 3001;

exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES = process.env.JWT_EXPIRES;
exports.COOKIES_EXPIRES = process.env.COOKIES_EXPIRES;

exports.ACCOUNT_SID = process.env.ACCOUNT_SID;
exports.AUTH_TOKEN = process.env.AUTH_TOKEN;
exports.TWILIOPHNO = process.env.TWILIOPHNO;
exports.SERVICE_ID = process.env.SERVICE_ID;

exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
exports.CLOUDINARY_SECURE_DELIVERY_URL =
  process.env.CLOUDINARY_SECURE_DELIVERY_URL;

exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
exports.EMAIL_HOST = process.env.EMAIL_HOST;
exports.EMAIL_PORT = process.env.EMAIL_PORT;

// Error
exports.USER_ERRORS = {
  USER_NOT_FOUND: { code: 404, message: 'User not found' },
  USER_ALREADY_EXISTS: { code: 409, message: 'User already exists' },
  NOT_AUTHENTICATED: { code: 401, message: 'You are not authenticated' },
  WRONG_PASSWORD: { code: 400, message: 'Wrong Password' },
};

exports.EMAIL_ERRORS = {
  EMAIL_FAILED: {
    code: 500,
    message: 'There is something went wrong while sending email.',
  },
};

exports.OTP_ERRORS = {
  WRONG_OTP: {
    code: 400,
    message: 'Wrong OTP',
  },
  EXPIRED_OTP: {
    code: 404,
    message: 'Your OTP was expired.',
  },
};

exports.BLOCK_USER_ERRORS = {
  USER_NOT_FOUND: {
    code: 404,
    message:
      'This content is not available. You have been blocked by this user.',
  },
};

exports.POST_ERRORS = {
  TAGGED_USER_NOT_FOUND: {
    code: 404,
    message: 'Tagged user id does not exist in your friend list.',
  },
  POST_NOT_FOUND: {
    code: 404,
    message: 'Post not found.',
  },
  IMAGE_NOT_FOUND: {
    code: 400,
    message: 'Image not found.',
  },
  DELETE_IMAGE_FAILS: {
    code: 500,
    message: 'There is something went wrong while deleting images.',
  },
  OWNER_ONLY_ALLOWED: {
    code: 401,
    message: 'You are not allowed.',
  },
};

exports.COMMENT_ERRORS = {
  COMMENT_NOT_FOUND: {
    code: 404,
    message: 'Comment not found.',
  },
  OWNER_ONLY_ALLOWED: {
    code: 401,
    message: 'You are not allowed.',
  },
};

exports.FRIEND_REQUEST_ERRORS = {
  NOT_ADD_YOURSELF: {
    code: 400,
    message: 'You cannot add friend yourself.',
  },
  USER_BLOCKED: {
    code: 404,
    message: 'You have been blocked by this user.',
  },
  CONFILCT_FRIEND_REQUEST: {
    code: 500,
    message: 'There is something went wrong while adding friend.',
  },
  REQUEST_NOT_FOUND: {
    code: 404,
    message: 'Request not found.',
  },
  FRIEND_USER_NOT_FOUND: {
    code: 404,
    message: 'User is not your friends-list',
  },
  BLOCKED_USER_NOT_FOUND: {
    code: 404,
    message: 'User is not your blocked-list.',
  },
};

exports.LIKE_ERRORS = {
  ALREADY_LIKED: {
    code: 500,
    message: 'You have already liked this post.',
  },
  LIKE_NOT_FOUND: {
    code: 404,
    message: 'Like not found.',
  },
};

exports.SHARE_POST_ERRORS = {
  SHARE_POST_NOT_FOUND: {
    code: 404,
    message: 'Share post not found.',
  },
};

exports.SAVED_POST_ERRORS = {
  SAVED_POST_NOT_FOUND: {
    code: 404,
    message: 'Saved post not found.',
  },

  ALREADY_SAVED: {
    code: 500,
    message: 'You have already saved this post.',
  },
};
