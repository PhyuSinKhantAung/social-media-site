// const validate = (schema) => (payload) =>
//   schema.validate(payload, {
//     abortEarly: false,
//     allowUnknown: true,
//     convert: false,
//     errors: { label: 'key', wrap: { label: false } },
//   });

// const validation = (schema) => (req, res, next) => {
//   const { error, value } = validate(schema)(req.body);
//   if (error) {
//     const errMsg = error.details.map((i) => i.message).join(',');
//     console.log(error);
//     next(new BadRequestError(errMsg, 400));
//   } else {
//     next();
//   }
// };

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
    convert: false,
    errors: { label: 'key', wrap: { label: false } },
  });

  if (error) {
    return res.status(400).json({
      code: 400,
      message: error.details[0].message,
    });
  }
  next();
};

const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, {
    abortEarly: false,
    allowUnknown: true,
    convert: false,
    errors: { label: 'key', wrap: { label: false } },
  });

  if (error) {
    return res.status(400).json({
      code: 400,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = { validateBody, validateParams };
