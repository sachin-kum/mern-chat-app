const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/jwtToken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const fileDelete = (file) => {
  let pathd = req.file.path;
  fs.unlink(pathd, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("deleted");
  });
};
//register
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  let url;
  if (req.file) {
    url = await cloudinary.uploader.upload(req.file.path, {
      transformation: {
        width: 500,
        crop: "scale",
        format: "auto",
      },
      folder: "chatApp",
    });
  }

  if (!name || !email || !password) {
    res.status(400).json({
      msg: "All Fiels are required",
      success: false,
    });
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    req.file &&
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    return res.status(200).json({
      msg: "Email alredy exist",
      success: false,
      email: false,
      status_code: 409,
    });
  }
  const user = await User.create({
    name,
    email,
    password,
    pic: url?.secure_url,
  });

  req.files && fileDelete(req.files);

  if (user) {
    res.status(201).json({
      msg: "user created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      },
      success: true,
    });
  } else {
    return res.status(400).json({
      msg: "Failed to create user",
      success: false,
    });
  }
  req.file &&
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("deleted");
    });
});

//lgoin
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401).json({
      msg: "Invalid Email or Password",
      success: false,
      status_code: 409,
    });
  }
});

//all users

exports.allUsers = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: new RegExp(req.query.search, "i") } },
          { email: { $regex: new RegExp(req.query.search, "i") } },
        ],
      }
    : {};
  // .find({ _id: { $ne: req.user._id } }

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  if (!users.length) {
    return res.status(200).json({ users, msg: "No Users Found" });
  }
  res.status(200).json({ users });
});
