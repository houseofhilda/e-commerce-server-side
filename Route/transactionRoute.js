const express = require("express");
const router = express.Router();

const {
  updateTransaction,
  allTransaction,
  postTransaction,
  getSingleTransaction,
  transactionStatus,
} = require("../Controller/Transaction/Transaction");

// admin access routes
router.post("/posttransaction", postTransaction);
router.get("/transactionstatus", transactionStatus);
router.get("/alltransaction", allTransaction);
router.get("/getsingletransaction/:id", getSingleTransaction);
router.patch("/updatetransaction/:id", updateTransaction);

module.exports = router;
