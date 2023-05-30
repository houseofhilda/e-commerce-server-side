const transporter = require("./nodeMailer"); // send OPT verification email
const bcrypt = require("bcrypt");
const UserOTPVerification = require("../../Schema/UserOTPVerification");

const sendOTPVerificationEmail = async ({ _id, useremail }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: useremail,
      subject: "Kindly Verify your email",
      html: `<p> Enter <b>${otp}</b> into the application to verify your email and complete your registration</p><p style=${{
        color: "red",
      }}> <b>This OTP will expire in 1 hour</b></p>`,
    };

    //   hash the otp
    const rounds = 10;
    const hashedOTP = await bcrypt.hash(otp, rounds);
    const newOTPVerification = await UserOTPVerification.create({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await newOTPVerification.save();

    // send mail
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      status: "PENDING",
      message: "Verification OTP sent",
      data: {
        userId: _id,
        useremail,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports = sendOTPVerificationEmail;
