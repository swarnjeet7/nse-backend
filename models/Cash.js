const mongoose = require("mongoose");

const CashSchema = mongoose.Schema({
  Symbol: {
    type: String,
    required: true,
  },
  Series: {
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
  Last: {
    type: Number,
    required: true,
  },
  PrevClose: {
    type: Number,
    required: true,
  },
  TotalTradeQuantity: {
    type: Number,
    required: true,
  },
  TotalTradeValue: {
    type: Number,
    required: true,
  },
  Timestamp: {
    type: Date,
    required: true,
  },
  TotalTrades: {
    type: Number,
    required: true,
  },
  ISIN: {
    type: String,
    required: true,
  },
  Profit: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Cash", CashSchema, "Cash");
