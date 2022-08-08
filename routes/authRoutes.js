const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/users");
const authController = require("../controllers/authcontrollers");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name", "Name must not be empty!").not().isEmpty(),
    body("password", "Password must be greater than 8 characters").not().isEmpty()
    .isLength({ min: 8, max: 16 })
    .custom(async (value, { req }) => {
      if(value.trim() === "") throw new Error("password must not be empty!");
    }),
    body("email")
      .normalizeEmail()
      .isEmail()
      .notEmpty()
      .custom(async (value, { req }) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          let error = new Error(
            "This email address already exists, Please choose another one."
          );
          error.statusCode = 400;
          throw error;
        }
        return true
      }),
  ],
  authController.postSignup
);

router.post("/login", [
  body("email")
  .custom(async (value, { req }) => {
    const user = await User.findOne({email: value});
    if ( !user ) {
      let error = new Error("No user with this email was found!")
      error.statusCode = 400;
      throw error
    }
    return true
  }),
  body("password")
  .custom(async (value, { req }) => {
    const user = await User.findOne({email: req.body.email});
    const doMatch = await bcrypt.compare(value, user.password);
    if(!doMatch) throw new Error("Incorrect password!")
    return true
  }),
], authController.postLogin);

// router.post('/login', authController.returnToken)

module.exports = router;