const { errorResponse } = require('../helpers/functions');

module.exports = {
  validatePayload: (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) return errorResponse(res, 400, error.details[0].message);
      next();
    };
  },
};
