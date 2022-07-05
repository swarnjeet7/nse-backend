const express = require("express");
const router = express.Router();
const _ = require("lodash");
const fs = require("fs");
const { parse } = require("csv-parse");
const FO = require("../models/FO");
const moment = require("moment");

router.get("/bhavcopy", function (req, res) {
  try {
    const {
      from,
      to = moment(new Date(from)).add(1, "days").format("MM/DD/yyyy"),
      ExpireDate = null,
      Symbol = null,
    } = req.query;

    const filter = {
      $gte: new Date(from),
      $lt: new Date(to),
    };

    if (Symbol) {
      filter.Symbol = Symbol;
    }
    if (ExpireDate) {
      filter.ExpireDate = { $lt: new Date(ExpireDate) };
    }

    FO.find(filter, function (err, docs) {
      if (err) throw err;

      res.json(docs);
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.post("/bhavcopy", function (req, res) {
  try {
    fs.createReadStream(req.files.file.tempFilePath)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        const fo = new FO({
          Instrument: row[0],
          Symbol: row[1],
          ExpireDate: row[2],
          StrikePR: row[3],
          OptionType: row[4],
          Open: row[5],
          High: row[6],
          Low: row[7],
          Close: row[8],
          SettlePR: row[9],
          Contracts: row[10],
          ValueInLakh: row[11],
          OpenInt: row[12],
          ChangeInOI: row[13],
          Timestamp: row[14],
        });
        fo.save();
      });

    res.status(200).send({
      status: 200,
      message: "The data has been updated successfully",
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
