const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const gravtar = require("gravatar");
require("dotenv/config");
const { validationResult } = require("express-validator");

const saltRound = process.env.SALT_ROUND;
const jwt_secret = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // type: "OAuth2",
    user: "nwobiprince8@gmail.com",
    pass: "38615271",
    // clientId: ,
    // clientSecret: ,
    // refreshToken: ,
  }
})

exports.postSignup = async (req, res, next) => {
  // let { name, email, password } = req.body;
  try {
    const userName = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      let error = new Error(errors.array()[0].msg);
      error.feedBack = { userName, password, email };
      error.statusCode = 401;
      throw error
    }
    
    let SALT = await bcrypt.genSalt(+saltRound);
    let hashedPassword = await bcrypt.hash(password, SALT);
    if (!hashedPassword) {
      let error = new Error("Hashing password failed");
      error.statusCode = 500;
      throw error;
    }
    const url = gravtar.url(email, { s: '200', r: 'pg', d: '404' })

    let user = new Users({
      username: userName,
      email: email,
      password: hashedPassword,
      profilePicture: url,
      contacts: []
    });
    await user.save();
    // transporter.sendMail({
    //   from: "nwobiprince8@gmail.com",
    //   to: email,
    //   subject: "Signup successfull",
    //   text: "Nice one, we hope you enjoy this application"
    // }, (err) => {
    //   if(err) return console.log(err)
    //   console.log("message sent to email address")
    // })
    return res.status(201).json({message: "User Created Successfully"})
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
  const errors = validationResult(req);
  if ( !errors.isEmpty() ) {
    let error = new Error(errors.array()[0].msg);
    error.statusCode = 400;
    throw error
  }
  const user = await Users.findOne({email: email})
  const token = jwt.sign({ userId: user._id }, jwt_secret, { expiresIn: "30m" });
  return res.json({ token, user, message: "Login Successfull..." })
  } catch (err) {
    next(err)
  }
}