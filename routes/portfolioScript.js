const express = require("express");
const router = express.Router();
const PortfolioScript = require("../models/PortfolioScript");

router.get("/", function (req, res) {
  const { Portfolio } = req.query;

  try {
    PortfolioScript.findOne({ Portfolio }, (err, script) => {
      if (err) throw err;
      return res.status(200).send({
        status: 200,
        message: "success",
        data: script || {
          Portfolio,
          Scripts: [],
        },
      });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.get("/top", function (req, res) {
  try {
    PortfolioScript.find({}, function (err, data) {
      if (err) throw err;
      
      res.json({
        status: 200,
        message: "success",
        data,
      });
    }).limit(1);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/", function (req, res) {
  const { Portfolio, Scripts } = req.body;

  try {
    PortfolioScript.findOne({ Portfolio }, (err, script) => {
      if (err) throw err;
      if (script) {
        return res.status(403).send({
          message: `The PortfolioName ${Portfolio} has already been existed.`,
        });
      }

      const portfolioScript = new PortfolioScript({
        Portfolio,
        Scripts,
      });

      portfolioScript.save().then((data) => {
        res.status(200).send({
          status: 200,
          message: "The PortfolioScript has been added successfully",
          data,
        });
      });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.patch("/", function (req, res) {
  const { Portfolio, Scripts } = req.body;
  try {
    PortfolioScript.findOne({ Portfolio }).exec((err, script) => {
      if (err) throw err;

      if (!script) {
        return res.status(400).send({
          message: `The portfolio script not found`,
        });
      }

      if (Portfolio) {
        script.Portfolio = Portfolio;
      }
      if (Scripts) {
        script.Scripts = Scripts;
      }

      script.save().then((portfolioScript) => {
        res.json({
          status: 200,
          message: "The portfolio script has been updated successfully",
          data: portfolioScript,
        });
      });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/", function (req, res) {
  const { Name } = req.body;

  try {
    PortfolioScript.findOneAndDelete({ Name }).exec((err, data) => {
      if (err) throw err;
      res.json({
        status: 200,
        message: "The portfolio script has been deleted successfully",
        data,
      });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
