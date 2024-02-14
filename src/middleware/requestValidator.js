module.exports = {
  validatePayload: (schema) => {
    return (req, res, next) => {
      const validationResult = schema.validate(req.body);
      if (validationResult.error) {
        return res
          .status(400)
          .json({ error: validationResult.error.details[0].message });
      }
      next();
    };
  },
  checkRole: (role) => {
    return (req, res, next) => {
      if (req.user && req.user.role === role) next();
      else res.redirect('/');
    };
  },
};
