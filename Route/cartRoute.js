const express = require("express");
const router = express.Router();

const {
  addToCart,
  updateCart,
  deleteCart,
  allCart,
} = require("../Controller/Store/Cart");

router.get("/allcart", allCart);
router.post("/addtocart", addToCart);
router.patch("/updatecart/:id", updateCart);
router.delete("/deletecart/:id", deleteCart);

module.exports = router;
