const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const authUser = asyncHandler(async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select("-password");
      next();
    } else {
      res.send("Can not search");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { authUser };
