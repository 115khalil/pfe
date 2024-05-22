const mongoose = require('mongoose');

// Define the schema for the Variable model
const variableSchema = new mongoose.Schema({
  sfaxcap: {
    type: Number,
  },
  djcap: {
    type: Number,
  },
  ecop: {
    type: Number,
  },
  luxp: {
    type: Number,
  },
  hadp: {
    type: Number,
  },
  sfaxcaplux: {
    type: Number,
  },
  sfaxcapeco: {
    type: Number,
  },
  sfaxcaphad: {
    type: Number,
  },
  djcaplux: {
    type: Number,
  },
  djcapeco: {
    type: Number,
  },
  djcaphad: {
    type: Number,
  },
});

// Create the Mongoose model for the Variable schema
const Variable = mongoose.model('Variable', variableSchema);

module.exports = Variable;
