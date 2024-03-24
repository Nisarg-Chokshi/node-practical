const Joi = require('joi');
const { STATUS } = require('../../helpers/constants');

module.exports = {
  addProductSchema: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    price: Joi.number().required(),
    status: Joi.string().valid(...Object.values(STATUS)).default(STATUS.AVAILABLE),
    availableQuantity: Joi.number().required(),
    quantitySold: Joi.number().required(),
  }),
  updateProductStatusSchema: Joi.object({
    id: Joi.string().required(),
    status: Joi.string().required().valid(...Object.values(STATUS)),
  }),
  addTransactionSchema: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().required().greater(0),
    price: Joi.number().required().greater(0),
    customerId: Joi.string().required(),
  }),
};
