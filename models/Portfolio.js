const mongoose = require("mongoose");

const PortfolioSchema = mongoose.Schema({
  Portfolio: {
    type: String,
    required: true,
    unique: true,
  },
  FullName: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  UpdatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Portfolio", PortfolioSchema, "Portfolio");
