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
  '/email/login',
  validation(userSchemas.loginUserSchema),
  authController.logInWithEmail
);

route.post(
  '/forgotpassword',
  validation(userSchemas.forgotPasswordSchema),
  authController.forgotPassword
);

route.post(
  '/resetpassword',
  validation(userSchemas.resetPasswordSchema),
  authController.resetPassword
);

route.get('/logout', authController.logout);

module.exports = route;
