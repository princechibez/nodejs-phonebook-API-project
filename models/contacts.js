const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  contactName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  contactCategory: {
    type: String,
    required: true,
  },
  contactImage: {
    type: String,
  },
});

module.exports = mongoose.model("Contacts", contactSchema);
