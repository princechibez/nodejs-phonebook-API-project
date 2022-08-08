const express = require("express");
const connectDB = require("./database/db");
require("dotenv/config");
const cors = require("cors");
const bodyParser = require("body-parser");
// const path = require('path');

const Users = require("./models/users");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userActions")

const app = express();

app.use(cors({ origin: "*" }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next()
});


app.use("/auth", authRoutes)
app.use("/users", userRoutes)

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json(error.message);
})

const port = process.env.PORT || 5000;

connectDB(() => {
  app.listen(port, () =>
    console.log(`Connected Successfully to port ${port}...`)
  );
});