/* eslint-disable no-console */

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose'); // for database
const app = require('./app'); // for server

const { PORT, MONGODB_URI } = require('./constant');

// uncaught error exception
process.on('uncaughtException', (err) => {
  console.log(
    'Uncaught Exception error occurred. Server will be shutting down!'
  );
  console.log(err);
  process.exit(1);
});

mongoose.set('strictQuery', false);

mongoose
  .connect(MONGODB_URI, {
    dbName: 'social-media-site',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDb connection is successful'));

const server = app.listen(PORT, () =>
  console.log(`Server is running on port: ${PORT} `)
);

// unhandle error rejection
process.on('unhandledRejection', (err) => {
  console.log(
    'Unhandled rejection error occurred. Server will be shutting down!'
  );
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
