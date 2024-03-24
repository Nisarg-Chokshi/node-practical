const Joi = require('joi');
const { USER_ROLES, GENDER } = require('../../helpers/constants');

module.exports = {
  registerSchema: Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    gender: Joi.string().required().valid(...Object.values(GENDER)),
    role: Joi.string().required().valid(...Object.values(USER_ROLES)),
  }),
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string(),
  }),
  changePasswordSchema: Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string(),
    newPassword: Joi.string(),
  }),
  resetPasswordSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string(),
  }),
};
