const router = require("express").Router();
const bcrypt = require("bcrypt");
const path = require("path");
const { isNotConnected } = require("../middleware/security");
const { getPasswordSize } = require("../utils");
const User = require("../models/User");

// Login Page
router.get("/login", isNotConnected, async (req, res) => {
  res.render("auth/login", {
    title: "Login"
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
  let locals;
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
      filename = "avatars/" + avatar;
    } else {
      let file = req.files.image;
      filename = "uploads/" + name.toLowerCase() + path.extname(file.name);
      let upload = __basedir + "/public/images/" + filename;
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
    await user.save();
    success = "You have registered successfully";
    locals = { success, email };
    req.flash("locals", locals);
    res.redirect("/auth/login");
  } else {
    locals = { errors, success, email, name };
    req.flash("locals", locals);
    res.redirect("/auth/register");
  }
});
// Login
router.post("/login", isNotConnected, async (req, res) => {
  let { email, password } = req.body;
  let errors = [];
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
      return;
    } else errors.push("Wrong email or password");
  }
  let locals = {
    errors,
    email
  };
  req.flash("locals", locals);
  res.redirect("/auth/login");
});
// Logout
router.get("/logout", (req, res) => {
  delete req.session.user;
  let success = "You have logged out successfully";
  let locals = { success };
  req.flash("locals", locals);
  res.redirect("/auth/login");
});

module.exports = router;
