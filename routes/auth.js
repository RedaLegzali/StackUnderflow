const router = require("express").Router();
const bcrypt = require("bcrypt");
const path = require("path");
const { isNotConnected } = require("../middleware/security");
const { getPasswordSize } = require('../utils')
const User = require("../models/User");

// Login Page
router.get("/login", isNotConnected, async (req, res) => {
  let success = req.flash("message");
  res.render("auth/login", {
    title: "Login",
    success
  });
});
// Register Page
router.get("/register", isNotConnected, (req, res) => {
  res.render("auth/register", {
    title: "Register"
  });
});
// Register
router.post("/register", isNotConnected, async (req, res) => {
  let { email, name, password, passwordConfirm, team, avatar } = req.body;
  let errors = [];
  let success = "";
  if (!email || !name || !password || !passwordConfirm || !team)
    errors.push("All fields are required");
  if (password !== passwordConfirm) errors.push("Passwords must match");
  if (password.length < getPasswordSize())
    errors.push(`Password size must be greater than ${getPasswordSize()}`);
  let user = await User.findOne({ email: email });
  if (user) errors.push("This email already exists");
  if (errors.length == 0) {
    let filename;
    if (!req.files || Object.keys(req.files).length === 0) {
      filename = avatar;
    } else {
      let file = req.files.image;
      filename = name.toLowerCase() + path.extname(file.name);
      let upload = __basedir + "/public/images/users/" + filename;
      file.mv(upload);
    }
    let hash = await bcrypt.hash(password, 10);
    let user = new User({
      name,
      email,
      image: filename,
      password: hash,
      team
    });
    user.save();
    success = "You have registered successfully";
  }
  res.render("auth/register", {
    title: "Register",
    email,
    name,
    errors,
    success
  });
});
// Login
router.post("/login", isNotConnected, async (req, res) => {
  let { email, password } = req.body;
  let errors = [];
  let success = "";
  if (!email || !password) errors.push("All fields are required");
  let user = await User.findOne({ email: email });
  if (!user) errors.push("Wrong email or password");
  if (errors.length == 0) {
    let match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user = {
        name: user.name,
        email,
        image: user.image,
        team: user.team
      };
      res.redirect("/questions");
    } else errors.push("Wrong email or password");
  }
  res.render("auth/login", {
    title: "Login",
    email,
    errors,
    success
  });
});
// Logout
router.get("/logout", (req, res) => {
  delete req.session.user;
  req.flash("message", "Logout successful");
  res.redirect("/auth/login");
});

module.exports = router;
