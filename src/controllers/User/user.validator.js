const Joi = require('joi');
const { USER_ROLES, TICKET_STATUS } = require('../../helpers/constants');

module.exports = {
  registerSchema: Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string()
      .required()
      .valid(...Object.values(USER_ROLES)),
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
  generateTicketSchema: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    remarks: Joi.string(),
    status: Joi.string()
      .valid(...Object.values(TICKET_STATUS))
      .default(TICKET_STATUS.PENDING),
  }),
};
