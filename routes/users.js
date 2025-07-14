const express = require("express");
const router = express.Router();
const _ = require("lodash");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const helpers = require("../utilities/helper");

router.delete("/", helpers.verifyToken, function (req, res) {
  const { UserName } = req.body;
  try {
    User.findOneAndDelete({ UserName: UserName }, (err, user) => {
      if (err) throw err;

      res.json({
        status: 200,
        user: user,
        message: `User has been deleted successfully`,
      });
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/all", helpers.verifyToken, function (req, res) {
  try {
    User.find({}, (err, docs) => {
      if (err) throw err;
      res.json({
        status: 200,
        message: `success`,
        data: docs,
      });
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.post("/login", async function (req, res) {
  const { UserName, Password } = req.body;

  try {
    const user = await User.findOne({ UserName: UserName.toLowerCase() });

    if (!user) {
      return res.json({
        status: 403,
        message: `Username: ${UserName} does not exist`,
      });
    }

    const isMatch = await user.comparePassword(Password, (err, isMatch) => {
      if (err) throw err;
      // continue with login logic
    }); // assuming comparePassword returns a Promise

    const { UserName: name, UserType, FullName } = user;
    const payload = {
      UserName: name,
      UserType,
      FullName,
    };

    if (isMatch) {
      const token = jwt.sign(payload, process.env.SECRET_CODE);
      return res.json({
        login: true,
        status: 200,
        UserType,
        message: "You have logged in successfully.",
        token,
      });
    } else {
      return res.json({
        login: true,
        status: 403,
        message: "Password does not match.",
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

router.post("/create", helpers.verifyToken, function (req, res) {
  const { UserName, UserType, FullName, Password, ConfirmPassword } = req.body;
  try {
    const user = new User({
      UserName: UserName.toLowerCase(),
      UserType,
      FullName,
      Password,
      ConfirmPassword,
    });

    user
      .save()
      .then((user, err) => {
        res.json({
          message: `Username ${UserName} has been created successfully`,
          status: 200,
        });
      })
      .catch((err) => {
        res.json({
          message: `Username ${UserName} has already existed. Please try another username`,
          status: 400,
        });
      });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.patch("/update", helpers.verifyToken, function (req, res) {
  const { UserName, UserType, FullName, Password, ConfirmPassword } = req.body;
  try {
    User.findOne({ UserName: UserName }, function (err, user) {
      if (err) throw err;
      if (UserType) {
        user.UserType = UserType;
      }
      if (FullName) {
        user.FullName = FullName;
      }
      if (Password) {
        user.Password = Password;
      }
      if (ConfirmPassword) {
        user.ConfirmPassword = ConfirmPassword;
      }
      user.save().then((err, data) => {
        if (err) res.json(err);
        res.json(data);
      });
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
