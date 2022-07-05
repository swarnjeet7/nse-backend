const jwt = require("jsonwebtoken");
const _ = require("lodash");

module.exports = {
  verifyToken: (req, res, next) => {
    let token = req.headers.authorization;
    if (req.headers.cookie) {
      const cookies = {};
      const cookiesString = req.headers.cookie;
      const cookiesArray = cookiesString.split(";");
      cookiesArray.forEach((cookie) => {
        const [key, value] = cookie.split("=");
        cookies[key] = value;
      });
      token = cookies.authorization;
    }

    const errorMessage = {
      status: 403,
      message:
        "You are not authorised to access the page or your token has been expired.",
    };

    if (token) {
      jwt.verify(token, process.env.SECRET_CODE, function (err, decoded) {
        if (err) {
          res.send(errorMessage);
        }
        next();
      });
    } else {
      res.send(errorMessage);
    }
  },
};
