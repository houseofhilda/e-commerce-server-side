const mongoose = require("mongoose");

adminAccessSchemaFunc = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Enter you full name"],
    minlength: [5, "Enter full name"],
    trim: true,
  },
  block: {
    type: Boolean,
    default: false,
  },
  useremail: {
    type: String,
    required: [true, "Enter your email address"],
    trim: true,
  },
  userphonenumber: {
    type: Number,
    required: [true, "Enter your active phone number"],
    trim: true,
  },
  position: {
    type: String,
    default: "client",
  },
  policy: {
    type: Boolean,
    default: "false",
  },
  password: {
    type: String,
    required: [true, "Enter your password"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  transaction: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transactionSchema",
      required: true,
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cartSchema",
      required: true,
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("adminAccessSchema", adminAccessSchemaFunc);
