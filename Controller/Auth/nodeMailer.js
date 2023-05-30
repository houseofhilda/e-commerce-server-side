const nodemailer = require("nodemailer");

// set up node mailer engine
let transporter = nodemailer.createTransport({
  host: process.env.HOST,
  service: process.env.SERVICE,
  port: process.env.EMAIL_PORT,
  secure: process.env.SECURE,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS,
  },
});

module.exports = transporter;
