const mongoose = require('mongoose');

const { ObjectId, String } = mongoose.Schema.Types;

const notificationSchema = mongoose.Schema(
  {
    userTo: { type: ObjectId, ref: 'User' },
    userFrom: { type: ObjectId, ref: 'User' },
    ticket: { type: ObjectId, ref: 'Ticket' },
    type: { type: String },
    notificationStatus: { type: String, default: 'Unread' },
  },
  { versionKey: false, timestamps: true }
);

module.exports = {
  Notifications: mongoose.model('Notification', notificationSchema),
};
