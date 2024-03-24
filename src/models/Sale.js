const mongoose = require('mongoose');

const { Date, ObjectId, Number } = mongoose.Schema.Types;

const salesSchema = mongoose.Schema(
  {
    productId: { type: ObjectId, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    customerId: { type: ObjectId, ref: 'User' },
    date: { type: Date, required: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = {
  Sales: mongoose.model('Sale', salesSchema, 'sales'),
};
