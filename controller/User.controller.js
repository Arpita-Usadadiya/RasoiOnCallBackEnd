const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User.model");
require("dotenv").config();

//Use the JWT secret from .env (fallback to default for development)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

//Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

//USER SIGNUP
const UserSignup = async (req, res) => {
  try {
    const { name, email, password, phone, profileImage, addresses } = req.body;

    //Validate require fields
    if (!name || !email || !password || !phone || !profileImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user already exist by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      profileImage,
      addresses: addresses || [], //default empty array if no address
    });

    //save the user to the database
    await newUser.save();

    //Generate token
    const token = generateToken(newUser._id);

    //respond with user data
    res.status(201).json({
      message: "User has been registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        profileImage: newUser.profileImage,
        addresses: newUser.addresses,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

//User login with JWT
const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation for email and password
        if(!email || !password ) {
          return res.status(400).json({ message: "All fields are required" });
        }

        //existing email
        const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //password match or validation
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        addresses: user.addresses,
        createdAt: user.createdAt,
      },
      token,
    });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = {UserSignup, UserLogin};