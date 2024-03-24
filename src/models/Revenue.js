const mongoose = require('mongoose');

const { Number } = mongoose.Schema.Types;

const revenueSchema = mongoose.Schema(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = {
  Revenues: mongoose.model('Revenue', revenueSchema, 'revenues'),
};
