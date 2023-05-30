const transactionSchema = require("../../Schema/transactionSchema.js");
const userSchema = require("../../Schema/userSchema.js");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// POST TRANSACTION
const postTransaction = async (req, res) => {
  try {
    //
    const { deliveryaddress, product, anyinfo, deliveryfee, homedelivery } =
      req.body;

    // check if the user has a successful token login
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "FAILED",
        message: "No token provided, You dont have access to this data",
      });
    }

    // split token from bearer and get real value to verify
    const token = auth.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRET);

    if (!verifyToken) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalide token access" });
    }

    const user = await userSchema.findById(verifyToken.id);

    if (!user) {
      res.status(401).json({ msg: "user not found" });
    }
    const deliverycharges = deliveryfee + homedelivery;
    const products = [];
    let totalAmount = deliverycharges;

    for (const p of product) {
      const total = p.productprice * p.quantity; // calculate the total cost
      const newProduct = {
        productname: p.productname,
        productprice: p.productprice,
        productspec: p.productspec,
        quantity: p.quantity,
        clientnote: p.clientnote,
        total: total,
      };
      products.push(newProduct);
      totalAmount += total; // add the total cost to the totalAmount variable
    }

    const productsWithTotal = products.map((p) => ({
      productname: p.productname,
      productprice: p.productprice,
      productspec: p.productspec,
      quantity: p.quantity,
      clientnote: p.clientnote,
      total: p.total,
    }));

    // make a request to Paystack to initialize the transaction
    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    const data = {
      email: user.useremail,
      amount: totalAmount * 100, // Paystack amount is in kobo (i.e. 100 kobo = 1 Naira)
      metadata: {
        delivery_address: deliveryaddress,
        products: productsWithTotal,
      },
    };

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      data,
      { headers }
    );

    if (paystackRes.data.status !== true) {
      return res.status(400).json({
        status: "FAILED",
        message: "Failed to initialize transaction",
      });
    }

    const Transaction = new transactionSchema({
      deliveryaddress: deliveryaddress,
      product: productsWithTotal,
      totalAmount: totalAmount,
      paystackRef: paystackRes.data.data.reference,
      authorization_url: paystackRes.data.data.authorization_url,
      anyinfo: anyinfo,
      deliveryfee,
      homedelivery,
    });

    user.transaction.unshift(Transaction);
    await user.save();
    Transaction.user.unshift(user);
    await Transaction.save();

    res.status(200).json({
      status: "SUCCESS",
      data: {
        Transaction,
        authorization_url: paystackRes.data.data.authorization_url,
        reference: paystackRes.data.data.reference,
      },
    });
  } catch (error) {
    throw new Error(error);
    console.log(error);
  }
};

// FETCH ALL TRANSACTION
const allTransaction = async (req, res) => {
  try {
    // check if the user has a successful token lopgin
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "FAILED",
        message: "No token provided, You dont have access to this data",
      });
    }

    // split token from bearer and get real value to verify
    const token = auth.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRET);

    if (!verifyToken) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalide token access" });
    }
    // get all transaction the the database populated by the respective users
    const transaction = await transactionSchema
      .find({})
      .sort({ createdAt: -1 })
      .populate({ path: "user" });
    res.status(200).json({ status: "SUCCESS", data: transaction });
  } catch (error) {
    throw Error(error.message);
  }
};

//FETCH SINGLE TRANSACTION
const getSingleTransaction = async (req, res) => {
  try {
    // check if the user has a successful token lopgin
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "FAILED",
        message: "No token provided, You dont have access to this data",
      });
    }

    // split token from bearer and get real value to verify
    const token = auth.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRET);

    if (!verifyToken) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalide token access" });
    }
    // get all users the the database
    const singleTransaction = await transactionSchema
      .findById(req.params.id)
      .populate({
        path: "user",
      });

    // console.log(transaction);
    res.status(200).json({ status: "SUCCESS", data: singleTransaction });
  } catch (error) {
    throw Error(error.message);
  }
};

// update transaction status
const updateTransaction = async (req, res) => {
  try {
    // check if there is successfull token login
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "FAILED",
        message: "No token provided, You dont have access to this data",
      });
    }

    // get token and verify with jwt
    const token = auth.split(" ")[1];
    const verifyToken = await jwt.verify(token, process.env.SECRET);
    if (!verifyToken) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalide token access" });
    }

    // find user with token
    const allowAccess = await userSchema.findOne({
      _id: verifyToken.id,
    });

    // condition user with access
    if (allowAccess.verified != true) {
      return res.status(401).json({
        status: "ERROR",
        message: "You are not authorized to perform this action",
      });
    }

    // update transaction
    const transaction = await transactionSchema.findOneAndUpdate(
      { _id: req.params.id }, // specify the user to update
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: "SUCCESS", data: transaction });
  } catch (error) {
    throw new Error(error.message);
  }
};

const transactionStatus = async (req, res) => {
  try {
    const processingTransactions = await transactionSchema.find({
      status: "Processing",
    });
    const transactionDelivered = await transactionSchema.find({
      status: "Delivered",
    });
    const openTransaction = await transactionSchema.find({
      status: "Open",
    });

    return res.status(200).json({
      success: true,
      Processing: processingTransactions,
      Delivered: transactionDelivered,
      Open: openTransaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// console.log(transactionSchema.filter((item) => item.status === "Processing"));
module.exports = {
  postTransaction,
  updateTransaction,
  allTransaction,
  getSingleTransaction,
  transactionStatus,
};
