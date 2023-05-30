const cartSchema = require("../../Schema/cartSchema");
const jwt = require("jsonwebtoken");
const userSchema = require("../../Schema/userSchema");

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const {
      productID,
      image,
      productcategory,
      productclass,
      productdescription,
      productname,
      productnumber,
      productoldprice,
      productprice,
      quantity,
    } = req.body;

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
    const verifyToken = await jwt.verify(token, process.env.SECRET);

    if (!verifyToken) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalid token access" });
    }

    const user = await userSchema.findById(verifyToken.id);
    if (!user) {
      res.status(401).json({ msg: "user not found" });
    }

    const Cart = new cartSchema({
      productID,
      image,
      productcategory,
      productclass,
      productdescription,
      productname,
      productnumber,
      productoldprice,
      productprice,
      quantity,
      user: user._id,
    });

    await Cart.save();
    user.cart.unshift(Cart);
    await user.save();
    // Cart.user.unshift(user);
    // await Cart.save();

    res.status(200).json({
      status: "SUCCESS",
      data: Cart,
    });
  } catch (error) {
    throw new Error(error);
  }
};

// update transaction status
const updateCart = async (req, res) => {
  try {
    const { product } = req.body;
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

    const products = [];
    let totalAmount = 0;

    for (const p of product) {
      const total = p.productprice * p.quantity; // calculate the total cost
      const newProduct = {
        productname: p.productname,
        productprice: p.productprice,
        quantity: p.quantity,
        clientnote: p.clientnote,
        total: total,
        productnumber: p.productnumber,
        productoldprice: p.productoldprice,
      };
      products.push(newProduct);
      totalAmount += total; // add the total cost to the totalAmount variable
    }

    const productsWithTotal = products.map((p) => ({
      productname: p.productname,
      productprice: p.productprice,
      quantity: p.quantity,
      clientnote: p.clientnote,
      total: p.total,
      productclass: p.productclass,
      productcategory: p.productcategory,
      productdescription: p.productdescription,
      productnumber: p.productnumber,
      image: p.image,
      productoldprice: p.productoldprice,
      clientnote: p.clientnote,
    }));

    // update cat
    const cart = await cartSchema.findOneAndUpdate(
      { _id: req.params.id }, // specify the user to update
      { product: productsWithTotal, totalAmount: totalAmount }, // add totalAmount field and its value
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: "SUCCESS", data: cart });
  } catch (error) {
    throw new Error(error.message);
  }
};

// DELETE CART
const deleteCart = async (req, res) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "FAILED",
        message: "No token provided, You dont have access to this data",
      });
    }
    const token = auth.split(" ")[1];
    const verifyToken = await jwt.verify(token, process.env.SECRET);

    if (!verifyToken) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalide token access" });
    }

    const user = await userSchema.findOne({
      _id: verifyToken.id,
    });
    if (user.verified != true) {
      return res.status(401).json({
        status: "ERROR",
        message: "You are not authorized to perform this action",
      });
    }

    const newCart = user.cart.filter((item) => item._id != req.params.id);
    user.cart = newCart;
    await user.save();
    const deleteCart = await cartSchema.findOneAndDelete({
      _id: req.params.id,
    });

    res
      .status(200)
      .json({ status: "CART DELETED SUCCESSFUL", data: deleteCart });
  } catch (error) {
    throw new Error(error.message);
  }
};

// FETCH ALL TRANSACTION
const allCart = async (req, res) => {
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
    const cart = await cartSchema
      .find({})
      .sort({ createdAt: -1 })
      .populate({ path: "user" });
    res.status(200).json({ status: "SUCCESS", data: cart });
  } catch (error) {
    throw Error(error.message);
  }
};
module.exports = { addToCart, updateCart, deleteCart, allCart };
