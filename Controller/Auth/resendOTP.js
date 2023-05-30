const UserOTPVerification = require("../../Schema/UserOTPVerification");
const sendOTPVerificationEmail = require("./sendOTP");

// resend otp
const resendOTP = async (req, res) => {
  try {
    // get  the email and apssword
    const { userId, useremail } = req.body;

    // if none
    if (!userId || !useremail) {
      throw Error();
    } else {
      // delete any previous OTP record for that user
      await UserOTPVerification.deleteMany({ userId });
      // call the send otp middleware
      await sendOTPVerificationEmail({ _id: userId, useremail }, res);
    }
  } catch (error) {
    res.json({ status: "FAILED", message: error.message });
  }
};

module.exports = resendOTP;
