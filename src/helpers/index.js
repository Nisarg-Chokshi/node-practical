module.exports = {
  successResponse: (req, res, data, code = 200) =>
    res.send({
      code,
      data,
      status: true,
    }),
  errorResponse: (
    req,
    res,
    errorMessage = 'Something went wrong',
    code = 500,
    error = {}
  ) =>
    res.status(500).json({
      code,
      errorMessage,
      error,
      data: null,
      status: false,
    }),
  validateEmail: (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
};
