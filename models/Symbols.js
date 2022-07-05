const mongoose = require("mongoose");

const SymbolsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Symbols", SymbolsSchema, "Symbols");
