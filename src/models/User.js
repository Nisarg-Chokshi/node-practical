const mongoose = require('mongoose');
const { USER_ROLES } = require('../helpers/constants');

const { Boolean, Date, String } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, lowercase: true, unique: true, required: true },
    password: { type: String, required: true },
    contactNumber: { type: String, default: '' },
    profilePic: { type: String, default: '' },
    verifyToken: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(USER_ROLES), required: true },
    deleted: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true }
);

module.exports = {
  Users: mongoose.model('User', userSchema),
};
