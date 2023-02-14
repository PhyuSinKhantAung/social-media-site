const route = require('express').Router();
const authController = require('../controllers/auth.controller');
const validation = require('../middlewares/validation');
const userSchemas = require('../schemas/user.schema');

route.post(
  '/email/signup',
  validation(userSchemas.signupUserSchema),
  authController.signUpWithEmail
);

route.post(
  '/phone/signup',
  validation(userSchemas.signupUserSchema),
  authController.signUpWithPhone
);
route.post('/verify', authController.otpVerification);
route.get('/resend', authController.resendOtp);

route.post(
  '/email/login',
  validation(userSchemas.loginUserSchema),
  authController.logInWithEmail
);

route.post(
  '/phone/login',
  validation(userSchemas.loginUserSchema),
  authController.logInWithPhone
);
route.post('/verify/login', authController.otpVerificationLogin);

route.get('/logout', authController.logout);

module.exports = route;
