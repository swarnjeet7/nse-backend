const express = require("express");
const router = express.Router();
const Symbols = require("../models/Symbols");
const fs = require("fs");
const { parse } = require("csv-parse");

router.get("/", function (req, res) {
  try {
    Symbols.find({}, (err, data) => {
      if (err) throw err;
      res.json({
        status: 200,
        message: "Success",
        data,
      });
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.post("/", function (req, res) {
  try {
    fs.createReadStream(req.files.file.tempFilePath)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        const symbols = new Symbols({
          name: row[0],
        });
        symbols.save();
      });

    res.status(200).send({
      status: 200,
      message: "The symbols has been added successfully.",
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
