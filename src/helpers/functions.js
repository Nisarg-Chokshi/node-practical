const { MESSAGE } = require('./constants');

module.exports = {
  successResponse: (res, code, message, data) =>
    res.send({ isError: false, code, message, data }),
  errorResponse: (res, code, message = MESSAGE.SOMETHING_WENT_WRONG) =>
    res.status(500).json({ isError: true, code, message, data: null }),
  validateEmail: (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
};
