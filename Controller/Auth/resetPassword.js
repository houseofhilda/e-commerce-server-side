const UserOTPVerification = require("../../Schema/UserOTPVerification");
const userSchema = require("../../Schema/userSchema");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  const { userId, password } = req.body;
  try {
    // check if the user has an id and inputed an new password
    if (!userId || !password) {
      return res.status(400).json({
        status: "FAILED",
        message: "Enter New password",
      });
    }
    // if true  find the user
    const User = await userSchema.findOne({
      _id: userId,
    });
    // if no user , throw another error
    if (!User) {
      return res.status(400).json({
        status: "FAILED",
        message: "Account Record doest exist",
      });
    }
    // if non , throw another error
    if (User.password != "") {
      return res.status(400).json({
        status: "FAILED",
        message: "Enter OTP again",
      });
    }
    // using bcrypt to encrypt the password
    const rounds = 10;
    const hashPassword = await bcrypt.hash(password, rounds);

    await userSchema.updateOne({ _id: userId }, { password: hashPassword });
    // await UserOTPVerification.deleteMany({ userId });
    res.status(200).json({
      status: "SUCCESS",
      message: "Password Reset Successful",
    });
  } catch (error) {
    res.status(400).json({
      status: "FAILED",
      message: error,
    });
  }
};

module.exports = resetPassword;
