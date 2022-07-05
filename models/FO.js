const mongoose = require("mongoose");

const FOSchema = mongoose.Schema({
  Instrument: {
    type: String,
    required: true,
  },
  Symbol: {
    type: String,
    required: true,
  },
  ExpireDate: {
    type: Date,
    required: true,
  },
  StrikePR: {
    type: Number,
    required: true,
  },
  OptionType: {
    type: String,
    required: true,
  },
  Open: {
    type: Number,
    required: true,
  },
  High: {
    type: Number,
    required: true,
  },
  Low: {
    type: Number,
    required: true,
  },
  Close: {
    type: Number,
    required: true,
  },
  SettlePR: {
    type: Number,
    required: true,
  },
  Contracts: {
    type: Number,
    required: true,
  },
  ValueInLakh: {
    type: Number,
    required: true,
  },
  OpenInt: {
    type: Number,
    required: true,
  },
  ChangeInOI: {
    type: Number,
    required: true,
  },
  Timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("FO", FOSchema, "FO");
