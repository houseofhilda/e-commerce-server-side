const mongoose = require("mongoose");

UserOTPVerificationSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  expiresAt: {
    type: String,
  },
});

module.exports = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);
