const mongoose = require("mongoose");
const fs = require("fs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    contacts: [
      {
        contactName: { type: String, required: true },
        contactNumber: { type: String, required: true },
        contactCategory: { type: String, required: true },
        contactImage: { type: String },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.createNewContact = async function(newContactProperties) {
  try {
    let newContacts = [...this.contacts];
    newContacts.push(newContactProperties);
    this.contacts = newContacts;
    return this.save();
  } catch (err) {
    return false
  }
};

userSchema.methods.updateContact = async function(id, newContactProperties) {
  try {
    let newContacts = [...this.contacts];
    const existingContactIndex = newContacts.findIndex(contact => contact._id.toString() === id)
    if (!newContacts[existingContactIndex]) {
      throw new Error("Contact does not exist")
    }
    const contactToEdit = newContacts.find(contact => contact._id.toString() === id)
    for (let contactProp in newContactProperties) {
      contactToEdit[contactProp] = newContactProperties[contactProp]
    }
    newContacts[existingContactIndex] = contactToEdit;
    this.contacts = newContacts;
    this.save();
    return this.contacts[existingContactIndex]
  } catch (err) {
    return false
  }
}

userSchema.methods.deleteAllContacts = function () {
  for (let eachContact of this.contacts) {
      fs.unlink(eachContact.contactImage, (err) => {
        if (err) {
          console.log(err.message)
        }
      })
    }
  this.contacts = [];
  this.save();
  return this.contacts;
}

userSchema.methods.deleteContact = function (contactId) {
  let contacts = [ ...this.contacts ];
  const contactToDelete = contacts.find(contact => contact._id.toString() === contactId);
  if (!contactToDelete) return false;
    fs.unlink(contactToDelete.contactImage, (err) => {
      if (err) {
        console.log(err.message)
      }
    })
  let newContacts = contacts.filter(contact => contact !== contactToDelete);
  this.contacts = newContacts;
  this.save();
  return this.contacts;
}

userSchema.methods.updateContactProfilePicture = async function (id, image) {
  let userContacts = [...this.contacts];
  let contactIndex = userContacts.findIndex(contact => contact._id.toString() === id);
  if (userContacts[contactIndex].contactImage === image.path) {
    return
  }
    fs.unlink(this.contacts[contactIndex].contactImage, (err) => {
      if (err) {
        console.log(err.message)
      }
    })
    userContacts[contactIndex].contactImage = image.path
    this.contacts = userContacts;
    await this.save()
    return this.contacts[contactIndex]
}

module.exports = mongoose.model("User", userSchema);
