const UserOTPVerification = require("../../Schema/UserOTPVerification");
const userSchema = require("../../Schema/userSchema");

const sendOTPVerificationEmail = require("./sendOTP");

const resetPassword = async (req, res) => {
  // get the email the user just entered
  const { useremail } = req.body;

  // check if that email exist in the user database
  const existinguser = await userSchema.findOne({
    useremail: useremail,
  });
  // console.log(existinguser);
  if (!existinguser) {
    return res.status(400).json({
      status: "FAILED",
      error: `${useremail} is not a registered member, kindly register`,
    });
  }
  await UserOTPVerification.deleteMany({ userId: existinguser._id });
  try {
    // send OTP
    await sendOTPVerificationEmail({ _id: existinguser._id, useremail }, res);
  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  }
};

module.exports = resetPassword;
