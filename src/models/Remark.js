const mongoose = require('mongoose');
const { REMARK } = require('../helpers/constants');

const { String, ObjectId } = mongoose.Schema.Types;

const remarkSchema = new mongoose.Schema(
  {
    ticket: { type: ObjectId, ref: 'Ticket', required: true },
    user: { type: ObjectId, ref: 'User', required: true },
    content: { type: String },
    status: { type: String, enum: Object.values(REMARK), default: 'Pending' },
  },
  { versionKey: false }
);

module.exports = {
  Remarks: mongoose.model('Remark', remarkSchema),
};
