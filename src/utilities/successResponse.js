const successResponse = ({
  res,
  code = 200,
  data = {},
  token = '',
  message = '',
}) => {
  res.status(code).json({
    code,
    data,
    ...(token && { token }),
    ...(message && { message }),
    ...(Array.isArray(data) && { count: data.length }),
  });
};

module.exports = successResponse;
