const route = require('express').Router();
const authController = require('../controllers/auth.controller');
const { validateBody } = require('../middlewares/validation');
const userSchemas = require('../schemas/user.schema');

route.post(
  '/email/signup',
  validateBody(userSchemas.signupUserSchema),
  authController.signUpWithEmail
);

route.post(
  '/email/login',
  validateBody(userSchemas.loginUserSchema),
  authController.logInWithEmail
);

route.post(
  '/forgotpassword',
  validateBody(userSchemas.forgotPasswordSchema),
  authController.forgotPassword
);

route.post(
  '/resetpassword',
  validateBody(userSchemas.resetPasswordSchema),
  authController.resetPassword
);

route.get('/logout', authController.logout);

module.exports = route;
