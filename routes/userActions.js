const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");

const users = require("../models/users");
const isAuth = require("../middlewares/authMiddleware");
const userControllers = require("../controllers/userControllers");

const router = express.Router();

const contactProperties = (operationMode) => {
  return [
    body("contactName", "Please provide a name for your contact!")
      .not()
      .isEmpty(),
    body("contactNumber")
      .isMobilePhone()
      .withMessage("Must be a mobile number")
      .custom(async (value, { req }) => {
        if (value.trim() === "") throw new Error("Number must not be empty!");
        if (operationMode === "new") {
          const user = await users.findById(req.userId);
          const existingContact = user.contacts.find(
            (contact) => contact.contactNumber === value
          );
          if (existingContact) {
            let error = new Error("A contact with this number already exist.");
            error.statusCode = 400;
            throw error;
          }
        }
        return true;
      }),
    body("contactCategory", "Please provide a category for your contact!")
      .not()
      .isEmpty(),
  ];
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.contactId + "-" + file.originalname);
  },
});
  const fileFilter = (req, file, cb) => {
      if ( file.mimetype === "image/png" ||
       file.mimetype === "image/jpg" || 
       file.mimetype === "image/jpeg" ) {
        cb(null, true)
      } else {
        cb(null, false)
      }
  }

router.post(
  "/add-contact-profile-pix/:contactId",
  isAuth,
  multer({ storage: fileStorage,  fileFilter: fileFilter }).single("profile-image"),
  userControllers.updateContactProfilePix
);

router.post(
  "/addcontact",
  isAuth,
  contactProperties("new"),
  userControllers.addContact
);

router.get("/getallcontacts", isAuth, userControllers.getAllContacts);

router.get(
  "/getsinglecontact/:contactId",
  isAuth,
  userControllers.getSingleContact
);

router.patch(
  "/updatecontact/:contactId",
  isAuth,
  contactProperties("editing"),
  userControllers.updateContact
);

router.delete(
  "/deletecontact/:contactId",
  isAuth,
  userControllers.deleteContact
);

router.delete("/deleteallcontacts/", isAuth, userControllers.deleteAllContacts);

// router.delete("/logout", userControllers.logout)

module.exports = router;
