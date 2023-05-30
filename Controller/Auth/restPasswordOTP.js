const UserOTPVerification = require("../../Schema/UserOTPVerification");
const userSchema = require("../../Schema/userSchema");
const bcrypt = require("bcrypt");
const resetPasswordOTP = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    // check if the user has an id and inputed an otp
    if (!userId || !otp) {
      return res.status(400).json({
        status: "FAILED",
        message: "Enter OTP",
      });
    }

    // if true  find the otp sent to the user  from the otp database
    const UserOTPVerificationRecord = await UserOTPVerification.findOne({
      userId,
    });
    // if non , throw another error
    if (!UserOTPVerificationRecord) {
      return res.status(400).json({
        status: "FAILED",
        message: "Account Record doest exist, resend otp",
      });
    }

    //   check if the otp has expired
    const { expiresAt } = UserOTPVerificationRecord;
    const hashedOTP = UserOTPVerificationRecord.otp;

    if (expiresAt < Date.now()) {
      await UserOTPVerification.deleteMany({ userId });
      return res.status(400).json({
        status: "FAILED",
        message: "OTP has expired, Kindly resend OTP",
      });
    }
    const validOTP = await bcrypt.compare(otp, hashedOTP);

    if (!validOTP) {
      return res.status(400).json({
        status: "FAILED",
        message: "Incorrect OTP",
      });
    }
    await userSchema.updateOne({ _id: userId }, { password: "" });

    await UserOTPVerification.deleteMany({ userId });
    res.status(200).json({
      status: "SUCCESS",
      message: "Reset password",
    });
  } catch (error) {
    res.status(400).json({
      status: "FAILED",
      message: error,
    });
  }
};

module.exports = resetPasswordOTP;
