const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MONGODB_URI, SESSION_SECRET, NODE_ENV } = require('./constant');
const router = require('./index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// session implementation
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// security
app.options('*', cors());
app.use(helmet());

// morgan logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// parsing
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/', router);
app.use((req, res, next) => {
  next({ code: 404, message: `Can't find ${req.originalUrl} on this server.` });
});
app.use(errorHandler);

module.exports = app;
