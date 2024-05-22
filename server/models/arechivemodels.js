const mongoose = require("mongoose");

const archiveSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  carModel: {
    type: String,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
  },
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
  },
  title: {
    type: String
  },
});

const ArchiveModel = mongoose.model("archive", archiveSchema);
module.exports = ArchiveModel;
