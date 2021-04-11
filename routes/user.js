const { isConnected } = require("../middleware/security");
const { getPasswordSize } = require("../utils");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Question = require("../models/Question");
const router = require("express").Router();
const isValid = require("mongoose").Types.ObjectId.isValid;

// Get profile
router.get("/profile", isConnected, (req, res) => {
  res.render("profile/profile", {
    title: "Profile"
  });
});
// Put profile
router.post("/profile", isConnected, async (req, res) => {
  let {
    name,
    email,
    oldPassword,
    password,
    passwordConfirm,
    team,
    avatar
  } = req.body;
  let user = await User.findOne({ email: req.session.user.email });
  let errors = [];
  let success = "";
  if (!email || !name || !oldPassword || !password || !passwordConfirm || !team)
    errors.push("All fields are required");
  if (password !== passwordConfirm) errors.push("Passwords must match");
  if (password.length < getPasswordSize())
    errors.push(`Password size must be greater than ${getPasswordSize()}`);
  if (oldPassword) {
    let match = await bcrypt.compare(oldPassword, user.password);
    if (!match) errors.push("Wrong old password");
  }
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
    user.name = name;
    user.email = email;
    user.password = hash;
    user.team = team;
    user.image = filename;
    req.session.user = {
      name,
      email,
      image: filename,
      team
    };
    await user.save();
    success = "User edited successfully";
  }
  let locals = { success, errors };
  req.flash("locals", locals);
  res.redirect("/user/profile");
});
// Delete user
router.get("/delete", isConnected, async (req, res) => {
  await Question.deleteMany({ user: req.session.user.email });
  await User.deleteOne({ email: req.session.user.email });
  delete req.session.user;
  let success = "User deleted successfully";
  let locals = { success };
  req.flash("locals", locals);
  res.redirect("/auth/login");
});
// Get user questions
router.get("/questions", isConnected, async (req, res) => {
  let questions = await Question.find({ user: req.session.user.email });
  res.render("profile/questions", {
    title: "My Question",
    questions
  });
});
// Edit question
router.post("/questions", isConnected, async (req, res) => {
  let { id, subject, body, category } = req.body;
  let errors = [];
  let success = "";
  if (isValid(id)) {
    if (!subject || !body || !category) errors.push("All field are required");
    if (errors.length == 0) {
      let question = await Question.findOne({ _id: id });
      question.subject = subject;
      question.body = body;
      question.category = category;
      await question.save();
      success = "Question edited successfully";
    }
  }
  let locals = { errors, success };
  req.flash("locals", locals);
  res.redirect("/user/questions");
});
// Delete question
router.get("/questions/:id", isConnected, async (req, res) => {
  let id = req.params.id;
  if (isValid(id)) {
    await Question.deleteOne({ _id: id });
    let success = "Question deleted successfully";
    let locals = { success };
    req.flash("locals", locals);
  }
  res.redirect("/user/questions");
});
module.exports = router;
