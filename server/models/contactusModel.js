const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema({
email : {
   type: String,
},
 errorType: {
    type: String,
    required: true,
 },
 specificError: {
    type: String,
    required: true,
 },
 message: {
    type: String,
    required: true,
 },
 // Timestamp for when the contact form was submitted
 createdAt: {
    type: Date,
    default: Date.now,
 },
});

const ContactUsModel = mongoose.model("ContactUs", ContactUsSchema);

module.exports = ContactUsModel;
