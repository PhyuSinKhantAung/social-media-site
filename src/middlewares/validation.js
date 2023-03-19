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
