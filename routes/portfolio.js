const express = require("express");
const router = express.Router();
const PortfolioModal = require("../models/Portfolio");
const moment = require("moment");

router.get("/", function (req, res) {
  try {
    PortfolioModal.find({}, function (err, data) {
      if (err) throw err;
      res.json({
        status: 200,
        message: "success",
        data,
      });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/", function (req, res) {
  const { Portfolio } = req.body;
  try {
    PortfolioModal.findOneAndDelete({ Portfolio }, function (err, portfolio) {
      if (err) throw err;

      res.json({
        status: 200,
        message: "Portfolio has been deleted successfully",
        portfolio,
      });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/", function (req, res) {
  const { FullName, Portfolio, Address } = req.body;
  try {
    PortfolioModal.findOne({ Portfolio }, (err, user) => {
      if (user) {
        return res.status(400).send({
          message: `The ${Portfolio} has already been existed. Please choose another name.`,
        });
      }

      const portfolio = new PortfolioModal({
        FullName,
        Portfolio,
        Address,
      });

      portfolio.save().then((data) => {
        res.status(200).send({
          status: 200,
          message: "The Portfolio has been created successfully",
          data,
        });
      });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.patch("/", function (req, res) {
  const { Portfolio, FullName, Address } = req.body;

  try {
    PortfolioModal.findOne({ Portfolio }).exec((err, portfolio) => {
      if (err) throw err;
      if (!portfolio) {
        return res.status(400).send({
          message: `The user not found`,
        });
      }
      portfolio.FullName = FullName;
      portfolio.Portfolio = Portfolio;
      portfolio.Address = Address;

      portfolio.save().then((user) => {
        res.json({
          status: 200,
          message: "The user has been updated successfully",
          data: user,
        });
      });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
