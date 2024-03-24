const mongoose = require('mongoose');
const { STATUS } = require('../helpers/constants');

const { Number, ObjectId, String } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: false, default: [] },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.AVAILABLE,
    },
    availableQuantity: { type: Number, default: 0 },
    quantitySold: { type: Number, default: 0 },
    generatedBy: { type: ObjectId, ref: 'User' },
  },
  { versionKey: false, timestamps: true }
);

module.exports = {
  Products: mongoose.model('Product', productSchema, 'products'),
};
