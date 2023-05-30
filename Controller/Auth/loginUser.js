const userSchema = require("../../Schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// log in as an admin
const loginUser = async (req, res) => {
  try {
    // get the email and password from user input
    const { useremail, password } = req.body;

    if (!useremail || !password) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Enter email and password" });
    }
    // check if user with that email exist
    const user = await userSchema.findOne({ useremail });

    if (!user) {
      return res.status(400).json({
        status: "FAILED",
        message: "Email is not asigned to a valide user, Kindly register",
      });
    }
    // if the email is not found or the password doesnt match return error

    // encrypt the password
    const validPassword = await bcrypt.compare(password, user.password);

    // if user have not verified email then no access
    if (user.verified === false) {
      return res.status(403).json({
        status: "ERROR",
        message: "Email has not been verified, Kindly Verify you email",
      });
    }
    // if user have been blocked
    if (user.block === true) {
      return res.status(403).json({
        status: "ERROR",
        message: "You have been blocked from accessing this application",
      });
    }

    // if the email is not found or the password doesnt match return error
    if (!user || !validPassword) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Invalid email or password" });
    }

    // if it matches then create a token with the details
    const userToken = {
      username: user.username,
      id: user.id,
    };

    // const token = jwt.sign(userToken, process.env.SECRET, { expiresIn: "1d" });
    const token = jwt.sign(userToken, process.env.SECRET);

    res.status(200).json({ status: "SUCCESS", data: token });
  } catch (error) {
    throw Error(error.message);
  }
};

module.exports = loginUser;
