const User = require("../models/users");

const { validationResult } = require("express-validator");

exports.addContact = async (req, res, next) => {
  try {
    const { contactName, contactNumber, contactCategory } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }
    let user = await User.findById(req.userId);
    const newContact = await user.createNewContact({
      contactName,
      contactNumber,
      contactCategory,
      contactImage: "",
    });
    if (!newContact)
      res
        .status(500)
        .json({ message: "Creating contact failed, please try again." });
    if (newContact)
      res
        .status(201)
        .json({ message: "A new contact created successfully...", newContact: newContact.contacts.filter(contact => contact.contactNumber === contactNumber)});
  } catch (err) {
    next(err);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const userContacts = user.contacts;
    if(userContacts.length === 0) res.status(200).json({contacts: userContacts, message: "Your contact list is empty"})
    if(userContacts.length > 0) res.status(200).json({contacts: userContacts})
  } catch (err) {
    next(err);
  }
};

exports.getSingleContact = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const user = await User.findById(req.userId);
        const userContact = user.contacts.find(contact => contact._id.toString() === contactId.toString())
        if(!userContact) res.status(200).json("This contact does'nt exist again, seems you've deleted it")
        if(userContact) res.status(200).json({contact: { ...userContact._doc }})
      } catch (err) {
        next(err);
      }
};

exports.updateContact = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const {contactName, contactNumber, contactCategory} = req.body;
        const user = await User.findById(req.userId);
        const edited = await user.updateContact(contactId.toString(), {contactName, contactNumber, contactCategory})
        if(!edited) res.status(400).json("This contact does'nt exist again, seems you've deleted it")
        if(edited) res.status(200).json({contact: edited})
      } catch (err) {
        next(err);
      }
};

exports.deleteContact = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const user = await User.findById(req.userId);
        const newContacts = await user.deleteContact(contactId.toString());
        if(!newContacts) res.status(400).json("This contact can't be found");
        if(newContacts) res.status(200).json({message: "contact deleted successfully", newContacts })
      } catch (err) {
        next(err);
      }
};

exports.deleteAllContacts = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const deletedContacts = await user.deleteAllContacts();
        if(deletedContacts) res.status(200).json({message: "All contacts deleted successfully", contacts: deletedContacts})
      } catch (err) {
        next(err);
      }
};

exports.updateContactProfilePix = async (req, res, next) => {
  try {
        const contactId = req.params.contactId;
        const image = req.file;
        const user = await User.findById(req.userId);
        if(!image)  {
            let error = new Error("Choose a valid image please!");
            error.statusCode = 400;
            throw error;
        }
        const result = user.updateContactProfilePicture(contactId, image)
        result ? res.status(201).json({message: "Contact's profile picture updated successfully"}) :
        res.status(500).json({message: "Couldn't updated your contact's profile picture at the moment"})
    } catch (err) {
        next(err)
    }
};

// exports.logout = (req, res, next) => {
//     console.log(req.userId)
// }
