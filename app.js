// Load .env file
require("dotenv").config();

// Global Basedir
global.__basedir = __dirname

// Require all the dependencies
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require('express-flash')
const morgan = require("morgan");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 3000;
// View Engine : EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
// Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
);
// Flash
app.use(flash());
// Public Folder
app.use(express.static("public"));
// Logger
app.use(morgan("combined"));
// Body Parser
app.use(express.urlencoded({ extended: false }));
// File Upload
app.use(fileUpload())
// Index Routes
app.use("/", require("./routes/index"))
// Auth Routes
app.use("/auth", require("./routes/auth"))

// Mongodb Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Mongoose => Connection Successful"))
  .catch((err) => console.log(err));

// Server Creation
const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);
