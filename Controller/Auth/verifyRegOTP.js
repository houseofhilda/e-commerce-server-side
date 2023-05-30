const UserOTPVerification = require("../../Schema/UserOTPVerification");
const bcrypt = require("bcrypt");
const userSchema = require("../../Schema/userSchema");

const verifyRegOTP = async (req, res) => {
  try {
    // get the userId and otp from the page or form
    const { userId, otp } = req.body;

    // throw error if theyre not avaliable
    if (!userId || !otp) {
      throw Error("Enter OTP");
    } else {
      // if its avaliable then find the one that matches the userId
      const UserOTPVerificationRecord = await UserOTPVerification.findOne({
        userId,
      });
      // if non , throw another error
      if (!UserOTPVerificationRecord) {
        throw new Error(
          "Account record doesnt exist or has been Verified, Kindly login or Re-register"
        );
      } else {
        const { expiresAt } = UserOTPVerificationRecord;
        const hashedOTP = UserOTPVerificationRecord.otp;

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ userId });
          throw new Error("OTP has expired, Kindly Register again");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);

          if (!validOTP) {
            throw new Error("Incorrect OTP");
          } else {
            await userSchema.updateOne({ _id: userId }, { verified: true });
            await UserOTPVerification.deleteMany({ userId });
            res.status(200).json({
              status: "SUCCESS",
              message: "Account sucessfully created",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error + "III" });
  }
};

module.exports = verifyRegOTP;
