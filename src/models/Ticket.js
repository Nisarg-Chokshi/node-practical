const mongoose = require('mongoose');
const { TICKET_STATUS, USER_ROLES } = require('./../helpers/constants');

const { ObjectId, String } = mongoose.Schema.Types;

const ticketSchema = new mongoose.Schema(
  {
    generatedBy: { type: ObjectId, ref: 'User', required: true },
    content: {
      title: { type: String },
      description: { type: String },
      images: [{ type: String }],
      videos: [{ type: String }],
    },
    remarks: { type: String },
    status: { type: String, enum: TICKET_STATUS, default: 'Pending' },
    history: { type: [ObjectId], required: false, default: [] },
  },
  { versionKey: false }
);

module.exports = {
  Tickets: mongoose.model('Ticket', ticketSchema),
};
