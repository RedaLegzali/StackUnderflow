const { isConnected } = require("../middleware/security");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = require("express").Router();
const passwordSize = 6;

// Get profile
router.get("/profile", isConnected, (req, res) => {
  res.render("app/profile", {
    title: "Profile",
    image: req.session.user.image,
    user: req.session.user
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
  if (password.length < passwordSize)
    errors.push(`Password size must be greater than ${passwordSize}`);
  if (oldPassword) {
    let match = await bcrypt.compare(oldPassword, user.password);
    if (!match) errors.push("Wrong old password");
  }
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
    user.save();
    success = "User edited successfully";
  }
  res.render("app/profile", {
    title: "Profile",
    image: req.session.user.image,
    user: req.session.user,
    errors,
    success
  });
});
// Delete user
router.get("/delete", isConnected, async (req, res) => {
  await User.deleteOne({ email: req.session.user.email });
  delete req.session.user;
  req.flash("message", "User deleted successfully");
  res.redirect("/auth/login");
});
// Get user questions
router.get("/questions", isConnected, (req, res) => {
  res.render("app/myquestions", {
    title: "My Question",
    image: req.session.user.image
  });
});

module.exports = router;
