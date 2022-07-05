const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Pivots = require("../models/Pivots");
const PortfolioScript = require("../models/PortfolioScript");
const Cash = require("../models/Cash");
const moment = require("moment");

router.get("/", function (req, res) {
  const {
    from,
    to = moment(new Date(from)).add(1, "days").format("MM/DD/yyyy"),
    Portfolio,
  } = req.query;

  try {
    if (Portfolio) {
      PortfolioScript.find({ Portfolio }, (err, script) => {
        if (err) throw err;
        if (!_.isEmpty(script[0].Scripts)) {
          Pivots.find(
            {
              $gte: new Date(from),
              $lt: new Date(to),
              Symbol: { $in: [...script[0].Scripts] },
            },
            (err, data) => {
              if (err) throw err;
              res.json({
                status: 200,
                message: "success",
                data,
              });
            }
          );
        }
      });
    } else {
      Pivots.find(
        {
          $gte: new Date(from),
          $lt: new Date(to),
        },
        (err, data) => {
          if (err) throw err;
          res.json({
            status: 200,
            message: "success",
            data,
          });
        }
      );
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.post("/", function (req, res) {
  const {
    from,
    to = moment(new Date(from)).add(1, "days").format("MM/DD/yyyy"),
  } = req.body;

  try {
    Pivots.find(
      {
        $gte: new Date(from),
        $lt: new Date(to),
      },
      (err, data) => {
        if (err) return err;
        if (!_.isEmpty(data)) {
          return res.json({
            status: 400,
            message: "The data already been existed",
            data,
          });
        }
      }
    );

    Cash.find(
      {
        $gte: new Date(from),
        $lt: new Date(to),
      },
      (err, data) => {
        if (err) throw err;

        _.map(data, (row) => {
          const { Symbol, Series, High, Low, Close } = row;
          const P = (High + Low + Close) / 3;
          const R1 = 2 * P - Low;
          const S1 = 2 * P - High;
          const R2 = P - S1 + R1;
          const S2 = P - (R1 - S1);
          const R3 = P - S2 + R2;
          const S3 = P - (R2 - S2);

          const pivots = new Pivots({
            Symbol,
            Series,
            P,
            R1,
            S1,
            R2,
            S2,
            R3,
            S3,
            Timestamp: new Date(from),
          });
          pivots.save();
        });

        res.json({
          status: 200,
          message: "Pivot table has been created successfully",
        });
      }
    );
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
