const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const helpers = require("./utilities/helper");
require("dotenv").config();

// Middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(bodyParser.json());

const cashBhavcopy = require("./routes/cashBhavcopy");
const foBhavcopy = require("./routes/foBhavcopy");
const portfolio = require("./routes/portfolio");
const portfolioScript = require("./routes/portfolioScript");
const users = require("./routes/users");
const pivots = require("./routes/pivots");
const simbols = require("./routes/symbols");

app.get("/", function (req, res) {
  res.send("App working");
});

app.use("/cash-reports", helpers.verifyToken, cashBhavcopy);
app.use("/fo-reports", helpers.verifyToken, foBhavcopy);
app.use("/portfolio", helpers.verifyToken, portfolio);
app.use("/pivots", helpers.verifyToken, pivots);
app.use("/portfolioScript", helpers.verifyToken, portfolioScript);
app.use("/user", users);
app.use("/symbols", simbols);

mongoose.connect(
  process.env.DB_CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("db connected");
  }
);

//to set the port export PORT=5000;
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`app is working on localhost:${port}`);
});
