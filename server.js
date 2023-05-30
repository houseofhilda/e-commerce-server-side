const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json({ limit: "500000000mb" }));
app.use(bodyParser.urlencoded({ limit: "500000000mb", extended: true }));
// middleware
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Enable CORS for all routes
app.use(cors());
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://e-commerce-client-ashen.vercel.app"
  );
  next();
});
app.use(helmet());
app.set("trust proxy", 1);
// app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// routes
const userAccess = require("./Route/userAuthRoute");
const transaction = require("./Route/transactionRoute");
const cartItems = require("./Route/cartRoute");
const vistorsMsg = require("./Route/ajisRoute");
app.use("/ajis/meaasge", vistorsMsg);
app.use("/api/v1/userverification", userAccess);
app.use("/api/v1/transaction", transaction);
app.use("/api/v1/cart", cartItems);

const connectDB = require("./Database/adminDB.js");
const connectAdminToDataBase = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(process.env.PORT || 1234, () => {
      console.log("app is listening on port 1234");
    });
  } catch (error) {
    console.log(error);
  }
};
connectAdminToDataBase();
//
