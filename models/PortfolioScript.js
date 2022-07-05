const mongoose = require("mongoose");

const PortfolioScriptSchema = mongoose.Schema({
  Portfolio: {
    type: String,
    required: true,
  },
  Scripts: {
    type: Array,
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

module.exports = mongoose.model(
  "PortfolioScript",
  PortfolioScriptSchema,
  "PortfolioScript"
);
