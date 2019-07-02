const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

mongoose.connect("mongodb://mongodb:27017/booksdocker", {
  useNewUrlParser: true
});

const app = express();

app.use(morgan("combined"));
app.use(cors("*"));
app.use(bodyParser.json());

app.use("/api/v1", require("./v1/router"));

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
