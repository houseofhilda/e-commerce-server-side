const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchemaFunc = new Schema({
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "adminAccessSchema",
      required: true,
    },
  ],
  image: { type: Array, required: true },
  productname: {
    type: String,
    required: true,
  },
  productID: {
    type: String,
    required: true,
  },
  productcategory: {
    type: String,
    required: true,
  },
  productclass: {
    type: String,
    // required: true,
  },
  productdescription: {
    type: String,
    required: true,
  },
  productnumber: {
    type: String,
    required: true,
  },
  productoldprice: {
    type: Number,
  },
  productprice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("cartSchema", cartSchemaFunc);
