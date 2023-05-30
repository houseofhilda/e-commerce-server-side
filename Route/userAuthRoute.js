const express = require("express");
const router = express.Router();

const loginUser = require("../Controller/Auth/loginUser.js");
const registerUser = require("../Controller/Auth/registerUser.js");
const verifyRegOTP = require("../Controller/Auth/verifyRegOTP");
const resendOTP = require("../Controller/Auth/resendOTP");
const forgotPassword = require("../Controller/Auth/forgetPassword.js");
const resetPasswordOTP = require("../Controller/Auth/restPasswordOTP.js");
const resetPassword = require("../Controller/Auth/resetPassword.js");
const {
  allUsers,
  updateUserPosition,
  deleteUser,
  filterUsers,
  getSessionUser,
  getSingleUser,
} = require("../Controller/Auth/usersCRUD.js");

// user authentication route
router.post("/registeruser", registerUser);
router.post("/verifyotp", verifyRegOTP);
router.post("/resendotp", resendOTP);
router.post("/loginuser", loginUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpasswordOTP", resetPasswordOTP);
router.post("/resetpassword", resetPassword);

// admin access routes
router.get("/allusers", allUsers);
router.get("/getsessionuser", getSessionUser);
router.get("/filterusers", filterUsers);
router.get("/getsingleuser/:id", getSingleUser);
router.patch("/updateuser/:id", updateUserPosition);
router.delete("/deleteuser/:id", deleteUser);

module.exports = router;
