/* eslint-disable no-unused-vars */
const { BadRequestError } = require('../errors');

const validate = (schema) => (payload) =>
  schema.validate(payload, {
    abortEarly: false,
    allowUnknown: true,
    convert: false,
    errors: { label: 'key', wrap: { label: false } },
  });

const validation = (schema) => (req, res, next) => {
  const { error, value } = validate(schema)(req.body);
  if (error) {
    const errMsg = error.details.map((i) => i.message).join(',');
    console.log(error);
    next(new BadRequestError(errMsg, 400));
  } else {
    next();
  }
};

module.exports = validation;
