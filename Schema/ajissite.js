const mongoose = require("mongoose");

ajisSiteMsg = mongoose.Schema({
  visitorname: {
    type: String,
  },
  visitoremail: {
    type: String,
  },
  visitorphonenumber: {
    type: Number,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("ajisSiteSchema", ajisSiteMsg);
